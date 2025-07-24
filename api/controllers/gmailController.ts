import { Request, Response } from "express";
import { google, youtube_v3 } from "googleapis";
import { oauth2Client } from "../config/googleConfig";
import { mailToMailSummaryDTO, mailToMailDTO } from "../helpers/mappers";
import { getTokens, setToken, removeToken } from "../helpers/tokenStorage";
import {
  extractEmailWithStyles,
  extractHtmlFromMessage,
  cleanEmailContent,
} from "../helpers/cherrio";
import { MailDTO } from "../interfaces/mail-interfaces";
import { Ollama } from "ollama";
import { removeHtmlTags, parseAIResponseToArray } from "../helpers/html-helper";

export const getMessages = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const nextPageToken = req.query.pageToken;
  const search = req.query.search;

  const tokens = getTokens()[userId];
  if (!tokens) {
    return res.status(401).json({ error: "Utilisateur non authentifié" });
  }
  try {
    oauth2Client.setCredentials(tokens);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
      pageToken: nextPageToken as string,
      q: search as string,
    });
    let messages = [];

    if (response.data.messages) {
      for (const message of response.data.messages) {
        if (message.id) {
          const messageDetail = await gmail.users.messages.get({
            userId: "me",
            id: message.id,
          });

          messages.push(mailToMailSummaryDTO(messageDetail.data));
        }
      }
    }
    return res.json({
      messages: messages || [],
      nextPageToken: response.data.nextPageToken,
    });
  } catch (error: any) {
    if (error.code === 401) {
      return res.status(401).json({
        error: "Token expiré",
        needsRefresh: true,
      });
    }
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des messages" });
  }
};

export const getMessageById = async (req: Request, res: Response) => {
  const { userId, messageId } = req.params;
  const tokens = getTokens()[userId];
  if (!tokens) {
    return res.status(401).json({ error: "Utilisateur non authentifié" });
  }
  oauth2Client.setCredentials(tokens);
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  let messageDetail = await gmail.users.messages.get({
    userId: "me",
    id: messageId,
    format: "full",
  });
  if (messageDetail) {
    const htmlContent = extractHtmlFromMessage(messageDetail.data);
    let processedEmail = null;
    if (htmlContent) {
      processedEmail = extractEmailWithStyles(htmlContent);
    }
    let mailDTO = mailToMailDTO(messageDetail.data);
    return res.json({
      // Email informations with raw body
      mailInfo: mailDTO,

      // Email data processed server-side
      processedEmail: {
        // HTML content of the email extracted and cleaned
        // null if email has no HTML version or extraction failed
        htmlContent: processedEmail?.html || null,

        // CSS styles extracted from email <head> (<style> tags)
        // null if no styles are defined in the email
        cssStyles: processedEmail?.css || null,

        // Flag indicating if email contains CSS styles
        // Used to decide display mode on client side
        hasStyles: processedEmail?.hasExternalStyles || false,
      },
    });
  } else {
    return res.status(404).json({ error: "Message non trouvé" });
  }
};

export const getFilteredMailsByAI = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const messageIds = req.body.messageIds;
    const userPrompt = req.body.userPrompt;
    const tokens = getTokens()[userId];
    if (!tokens) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }
    oauth2Client.setCredentials(tokens);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    let mails = [];
    for (const messageId of messageIds) {
      let messageDetail = await gmail.users.messages.get({
        userId: "me",
        id: messageId,
        format: "full",
      });
      const body = cleanEmailContent(messageDetail.data);
      const mailId = messageDetail.data.id ?? "";
      const subject =
        messageDetail?.data?.payload?.headers?.find((h) => h.name === "Subject")
          ?.value ?? "";
      mails.push({
        mailId,
        subject,
        body,
      });
    }
    const response = await askAI(mails, userPrompt);
    console.log("response", response);
    return res.status(200);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erreur lors de la récupération des messages" });
  }
};

async function askAI(mails: any[], userPrompt: string) {
  const ollama = new Ollama({ host: "http://localhost:11434" });
  // Étape 2: Préparer le prompt pour Ollama
  const emailsContext = mails
    .map(
      (email, index) =>
        `Email ${index + 1}:
  ID: ${email.mailId}
  Sujet: ${email.subject}
  Contenu: ${email.body}
  ---`
    )
    .join("\n\n");
  console.log("emailsContext", emailsContext);

  const prompt = `Tu es un assistant qui analyse des emails. Je vais te donner une liste d'emails et une requête de recherche.

Tu dois analyser chaque email et retourner UNIQUEMENT les IDs des emails qui correspondent EXACTEMENT à la requête.

IMPORTANT: 
- Réponds UNIQUEMENT avec les IDs des emails correspondants, séparés par des virgules
- Si aucun email ne correspond, réponds "AUCUN"
- Ne donne aucune explication, juste les IDs
- Sois précis dans ton analyse

Requête de recherche: "${userPrompt}"

Emails à analyser:
${emailsContext}

Réponse (IDs seulement):`;
  const response = await ollama.chat({
    model: "llama3.1", // ou ton modèle préféré
    messages: [{ role: "user", content: prompt }],
    stream: false,
    options: {
      temperature: 0.1,
      top_p: 0.1,
      num_predict: 200, // Limiter la réponse
    },
  });
  return response.message.content;
}
