import { calendar_v3, google } from "googleapis";
import { CalendarRepository } from "../repositories/calendar-repository";
import { getTokens } from "../helpers/tokenStorage";
import { oauth2Client } from "../config/googleConfig";
import Container, { Service } from "typedi";
import { eventToEventDTO } from "../helpers/mappers";
import { EventDTO } from "../interfaces/event-interface";

@Service()
export class CalendarService implements CalendarRepository {
  async getCalendarEvents(
    userId: string,
    options: {
      maxResults?: number;
      timeMin?: string;
      singleEvents?: boolean;
      orderBy?: string;
      eventTypes?: string[];
    }
  ): Promise<{ events: EventDTO[] }> {
    const tokens = getTokens()[userId];
    if (!tokens) {
      throw new Error("User not authenticated");
    }
    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: options.timeMin || new Date().toISOString(),
      maxResults: options.maxResults || 10,
      singleEvents: options.singleEvents !== false,
      orderBy: options.orderBy || "startTime",
      eventTypes: options.eventTypes || ["birthday", "fromGmail", "default"],
    });

    const events = response.data.items?.map(eventToEventDTO) || [];
    return { events };
  }

  async getHolidayEvents(
    userId: string,
    options: {
      maxResults?: number;
      timeMin?: string;
      singleEvents?: boolean;
      orderBy?: string;
    }
  ): Promise<{ events: EventDTO[] }> {
    const tokens = getTokens()[userId];
    if (!tokens) {
      throw new Error("User not authenticated");
    }
    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const holidayCalendarId = "en.be#holiday@group.v.calendar.google.com";

    const response = await calendar.events.list({
      calendarId: holidayCalendarId,
      timeMin: options.timeMin || new Date().toISOString(),
      maxResults: options.maxResults || 10,
      singleEvents: options.singleEvents !== false,
      orderBy: options.orderBy || "startTime",
    });

    const events = response.data.items?.map(eventToEventDTO) || [];
    return { events };
  }
}
