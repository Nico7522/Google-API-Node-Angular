import { Request, Response } from "express";
import { google } from "googleapis";
import { tokenStorage } from "./authController";
import { oauth2Client } from "../config/googleConfig";

export const getCalendarEvents = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const tokens = tokenStorage.get(userId);
  if (!tokens) {
    return res.status(401).json({ error: "Utilisateur non authentifié" });
  }
  try {
    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });
    res.json({
      events: response.data.items || [],
      total: response.data.items?.length || 0,
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
      .json({ error: "Erreur lors de la récupération des événements" });
  }
};
