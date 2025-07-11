export interface Mail {
  id: string;
  threadId: string;
  snippet: string;
  date: string; // Date in RFC 3339 format
  body: string; // Email body content
  from: string; // Optional sender email address
  subject: string; // Optional email subject
}
