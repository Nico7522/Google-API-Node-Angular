import { calendar_v3, gmail_v1 } from "googleapis";
import { getMailBody } from "./get-mail-body";
import { MailDTO, MailSumarryDTO } from "../interfaces/mail-interfaces";
import { EventDTO } from "../interfaces/event-interface";

export function mailToMailDTO(messageDetail: gmail_v1.Schema$Message): MailDTO {
  const payload = messageDetail.payload;
  const body = getMailBody(messageDetail);

  return {
    id: messageDetail.id ?? "",
    threadId: messageDetail.threadId ?? "",
    snippet: messageDetail.snippet ?? "",
    from: payload?.headers?.find((h) => h.name === "From")?.value ?? "",
    to: payload?.headers?.find((h) => h.name === "To")?.value ?? "",
    subject: payload?.headers?.find((h) => h.name === "Subject")?.value ?? "",
    date: payload?.headers?.find((h) => h.name === "Date")?.value ?? "",
    body,
  };
}

export function mailToMailSummaryDTO(
  messageDetail: gmail_v1.Schema$Message
): MailSumarryDTO {
  const payload = messageDetail.payload;
  return {
    id: messageDetail.id ?? "",
    from: payload?.headers?.find((h) => h.name === "From")?.value ?? "",
    to: payload?.headers?.find((h) => h.name === "To")?.value ?? "",
    subject: payload?.headers?.find((h) => h.name === "Subject")?.value ?? "",
    date: payload?.headers?.find((h) => h.name === "Date")?.value ?? "",
    read: messageDetail.labelIds?.includes("UNREAD") ? false : true,
  };
}

export function eventToEventDTO(event: calendar_v3.Schema$Event): EventDTO {
  return {
    id: event.id ?? "",
    startAt: event.start?.date ?? "",
    summary: event.summary ?? "",
    description: event.description ?? "",
  };
}
