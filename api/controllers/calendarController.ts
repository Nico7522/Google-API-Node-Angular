import { Request, Response } from "express";
import Container from "typedi";
import { CalendarService } from "../services/calendar-service";

export const getCalendarEvents = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const response = await Container.get(CalendarService).getCalendarEvents(
      userId,
      {
        maxResults: 10,
        timeMin: new Date().toISOString(),
        singleEvents: true,
        orderBy: "startTime",
        eventTypes: ["birthday", "fromGmail", "default"],
      }
    );
    return res.json(response);
  } catch (error: any) {
    if (error.code === 401) {
      return res.status(401).json({
        error: "Token expiré",
        needsRefresh: true,
      });
    }
    console.log("Erreur lors de la récupération des événements:", error);
    return res
      .status(500)
      .json({ error: "Erreur lors de la récupération des événements" });
  }
};

export const getHolidayEvents = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const response = await Container.get(CalendarService).getHolidayEvents(
      userId,
      {
        maxResults: 10,
        timeMin: new Date().toISOString(),
        singleEvents: true,
        orderBy: "startTime",
      }
    );
    return res.json(response);
  } catch (error: any) {
    if (error.code === 401) {
      return res.status(401).json({
        error: "Token expiré",
        needsRefresh: true,
      });
    }
    console.log("Erreur lors de la récupération des événements:", error);
    return res
      .status(500)
      .json({ error: "Erreur lors de la récupération des événements" });
  }
};
