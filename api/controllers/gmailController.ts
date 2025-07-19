import { Request, Response } from "express";
import { google, youtube_v3 } from "googleapis";
import { oauth2Client } from "../config/googleConfig";
import { mailToMailSummaryDTO, mailToMailDTO } from "../helpers/mappers";
import { getTokens, setToken, removeToken } from "../helpers/tokenStorage";
import {
  extractEmailWithStyles,
  extractHtmlFromMessage,
} from "../helpers/cherrio";

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
