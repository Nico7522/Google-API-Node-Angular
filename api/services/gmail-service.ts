import { google } from "googleapis";
import { GmailRepository } from "../repositories/gmail-repository";
import { getTokens } from "../helpers/tokenStorage";
import { oauth2Client } from "../config/googleConfig";
import Container, { Service } from "typedi";
import { mailToMailSummaryDTO } from "../helpers/mappers";
import { MailSumarryDTO } from "../interfaces/mail-interfaces";
import {
  cleanEmailContent,
  extractEmailWithStyles,
  extractHtmlFromMessage,
} from "../helpers/cherrio";
import { AiService } from "./ai-services";

@Service()
export class GmailService implements GmailRepository {
  num = 1;
  async getFilteredMailsByAI(
    userId: string,
    messageIds: string[],
    userPrompt: string
  ): Promise<string[]> {
    const tokens = getTokens()[userId];
    if (!tokens) {
      throw new Error("User not authenticated");
    }
    oauth2Client.setCredentials(tokens);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    let cleanedMails = [];
    for (const messageId of messageIds) {
      const response = await gmail.users.messages.get({
        userId: "me",
        id: messageId,
        format: "full",
      });
      const body = cleanEmailContent(response.data);
      const mailId = response.data.id ?? "";
      const subject =
        response?.data?.payload?.headers?.find((h) => h.name === "Subject")
          ?.value ?? "";
      cleanedMails.push({
        mailId,
        subject,
        body,
      });
    }
    const response = await Container.get(AiService).askAI(
      userPrompt,
      cleanedMails
    );
    return response;
  }
  async getMessageById(
    userId: string,
    messageId: string
  ): Promise<{
    mailInfo: MailSumarryDTO;
    processedEmail: {
      htmlContent: string | null;
      cssStyles: string | null;
      hasStyles: boolean;
    };
  } | null> {
    const tokens = getTokens()[userId];
    if (!tokens) {
      throw new Error("User not authenticated");
    }
    oauth2Client.setCredentials(tokens);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const response = await gmail.users.messages.get({
      userId: "me",
      id: messageId,
      format: "full",
    });

    if (response.data) {
      const htmlContent = extractHtmlFromMessage(response.data);
      let processedEmail = null;
      if (htmlContent) {
        processedEmail = extractEmailWithStyles(htmlContent);
      }
      let mailDTO = mailToMailSummaryDTO(response.data);
      return {
        mailInfo: mailDTO,
        processedEmail: {
          htmlContent: processedEmail?.html || null,
          cssStyles: processedEmail?.css || null,
          hasStyles: processedEmail?.hasExternalStyles || false,
        },
      };
    }
    return null;
  }
  async listMessages(
    userId: string,
    options: {
      maxResults?: number;
      pageToken?: string;
      q?: string;
    }
  ): Promise<{ messages: MailSumarryDTO[]; nextPageToken: string | null }> {
    this.num++;
    console.log("num", this.num);
    const tokens = getTokens()[userId];
    if (!tokens) {
      throw new Error("User not authenticated");
    }
    oauth2Client.setCredentials(tokens);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const response = await gmail.users.messages.list({
      userId: "me",
      ...options,
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
    return {
      messages,
      nextPageToken: response.data.nextPageToken || null,
    };
  }
}
