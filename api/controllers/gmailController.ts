import { Request, Response } from "express";
import { google } from "googleapis";
import { tokenStorage } from "./authController";
import { oauth2Client } from "../config/googleConfig";
import { mailToMailSummaryDTO, mailToMailDTO } from "../helpers/mappers";

export const getMessages = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const tokens = tokenStorage.get(userId);
  if (!tokens) {
    return res.status(401).json({ error: "Utilisateur non authentifié" });
  }
  try {
    oauth2Client.setCredentials(tokens);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
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
      total: messages.length,
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
  const tokens = tokenStorage.get(userId);
  if (!tokens) {
    return res.status(401).json({ error: "Utilisateur non authentifié" });
  }
  oauth2Client.setCredentials(tokens);
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  let messageDetail = await gmail.users.messages.get({
    userId: "me",
    id: messageId,
  });
  if (messageDetail) {
    let mailDTO = mailToMailDTO(messageDetail.data);
    return res.json(mailDTO);
  } else {
    return res.status(404).json({ error: "Message non trouvé" });
  }
};
