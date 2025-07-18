import { MailSummary } from '../../../mail-summary/models/interfaces/mail-summary-interface';

export interface MailInformations extends MailSummary {
  id: string;
  threadId: string;
  snippet: string;
  date: string;
  body: string;
  from: string;
  subject: string;
}

export interface Mail {
  mailInfo: MailInformations;
  processedEmail: ProcessedEmail;
}

export interface ProcessedEmail {
  htmlContent: string | null;
  cssStyles: string | null;
  hasStyles: boolean;
}
