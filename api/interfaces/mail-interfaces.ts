export interface MailSumarryDTO {
  id: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  read?: boolean;
}
export interface MailDTO extends MailSumarryDTO {
  threadId: string;
  snippet: string;
  body: string;
}
