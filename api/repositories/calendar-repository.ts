import { EventDTO } from "../interfaces/event-interface";

export interface CalendarRepository {
  getCalendarEvents(
    userId: string,
    options: {
      maxResults?: number;
      timeMin?: string;
      singleEvents?: boolean;
      orderBy?: string;
      eventTypes?: string[];
    }
  ): Promise<{ events: EventDTO[] }>;

  getHolidayEvents(
    userId: string,
    options: {
      maxResults?: number;
      timeMin?: string;
      singleEvents?: boolean;
      orderBy?: string;
    }
  ): Promise<{ events: EventDTO[] }>;
}
