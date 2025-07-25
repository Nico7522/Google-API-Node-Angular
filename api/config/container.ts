import { DIContainer, IDIContainer } from "rsdi";
import { GmailService } from "../services/gmail-service";
import { AiService } from "../services/ai-services";
import { MailController } from "../controllers/gmailController";
import { CalendarController } from "../controllers/calendarController";
import { CalendarService } from "../services/calendar-service";
import { AuthService } from "../services/auth-service";
import { AuthController } from "../controllers/authController";

export type AppDIContainer = ReturnType<typeof configureDI>;

export default function configureDI() {
  return new DIContainer()
    .add("GmailService", () => new GmailService())
    .add("AiService", () => new AiService())
    .add("CalendarService", () => new CalendarService())
    .add("AuthService", () => new AuthService())
    .add(
      "MailController",
      ({ GmailService }) => new MailController(GmailService)
    )
    .add(
      "CalendarController",
      ({ CalendarService }) => new CalendarController(CalendarService)
    )
    .add(
      "AuthController",
      ({ AuthService }) => new AuthController(AuthService)
    );
}
