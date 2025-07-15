import { Request, Response } from "express";
import { google } from "googleapis";
import { oauth2Client } from "../config/googleConfig";
import { getTokens, setToken, removeToken } from "../helpers/tokenStorage";
import { eventToEventDTO } from "../helpers/mappers";

export const getCalendarEvents = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const tokens = getTokens()[userId];
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
      eventTypes: ["birthday", "fromGmail", "default"],
    });
    let eventDTO = response.data.items?.map(eventToEventDTO);
    res.json({
      events: eventDTO || [],
    });
  } catch (error: any) {
    if (error.code === 401) {
      return res.status(401).json({
        error: "Token expiré",
        needsRefresh: true,
      });
    }
    console.log("Erreur lors de la récupération des événements:", error);

    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des événements" });
  }
};

export const getHolidayEvents = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const tokens = getTokens()[userId];
  console.log(tokens);

  if (!tokens) {
    return res.status(401).json({ error: "Utilisateur non authentifié" });
  }
  try {
    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const holidayCalendarId = "en.be#holiday@group.v.calendar.google.com";

    const response = await calendar.events.list({
      calendarId: holidayCalendarId,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });
    let eventDTO = response.data.items?.map(eventToEventDTO);
    res.json({
      events: eventDTO || [],
    });
  } catch (error: any) {
    if (error.code === 401) {
      return res.status(401).json({
        error: "Token expiré",
        needsRefresh: true,
      });
    }
    console.log("Erreur lors de la récupération des événements:", error);

    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des événements" });
  }
};
