import { Request, Response } from "express";
import { GmailService } from "../services/gmail-service";

export class MailController {
  constructor(private readonly gmailService: GmailService) {}
  getMessage = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const nextPageToken = req.query.pageToken;
    const search = req.query.search;

    try {
      const response = await this.gmailService.listMessages(userId, {
        maxResults: 10,
        pageToken: nextPageToken as string,
        q: search as string,
      });
      return res.json(response);
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
  getMessageById = async (req: Request, res: Response) => {
    const { userId, messageId } = req.params;
    try {
      const response = await this.gmailService.getMessageById(
        userId,
        messageId
      );
      return res.json(response);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de la récupération du message" });
    }
  };

  getFilteredMailsByAI = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const messageIds = req.body.messageIds;
      const userPrompt = req.body.userPrompt;
      const response = await this.gmailService.getFilteredMailsByAI(
        userId,
        messageIds,
        userPrompt
      );
      return res.status(200).json({ mailIds: response });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de l'analyse des emails" });
    }
  };
}
