export function getMailBody(messageDetail: any): string {
  const payload = messageDetail.payload;
  // If multipart, look for 'text/plain' part
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body && part.body.data) {
        return Buffer.from(part.body.data, "base64").toString("utf-8");
      }
    }
  }
  // If not multipart, check payload.body.data
  if (payload.body && payload.body.data) {
    return Buffer.from(payload.body.data, "base64").toString("utf-8");
  }
  return "";
}
