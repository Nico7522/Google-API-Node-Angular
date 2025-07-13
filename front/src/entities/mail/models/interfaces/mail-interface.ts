import { MailSummary } from '../../../mail-summary/models/interfaces/mail-summary-interface';

export interface Mail extends MailSummary {
  id: string;
  threadId: string;
  snippet: string;
  date: string;
  body: string;
  from: string;
  subject: string;
}
