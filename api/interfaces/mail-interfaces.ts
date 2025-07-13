export interface MailSumarryDTO {
  id: string;
  from: string;
  to: string;
  subject: string;
  date: string;
}
export interface MailDTO extends MailSumarryDTO {
  threadId: string;
  snippet: string;
  body: string;
}
