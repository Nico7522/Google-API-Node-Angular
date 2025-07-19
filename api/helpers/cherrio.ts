import { gmail_v1 } from "googleapis";

// Côté Node.js - extraction complète
export function extractHtmlFromMessage(
  message: gmail_v1.Schema$Message
): string | null {
  function findHtmlPart(
    payload: gmail_v1.Schema$MessagePart
  ): gmail_v1.Schema$MessagePart | null {
    if (payload.mimeType === "text/html") {
      return payload;
    }

    if (payload.parts) {
      for (const part of payload.parts) {
        const found = findHtmlPart(part);
        if (found) return found;
      }
    }

    return null;
  }

  let htmlPart;
  if (message.payload) htmlPart = findHtmlPart(message.payload);
  else htmlPart = null;

  if (htmlPart && htmlPart?.body?.data) {
    // Décoder le contenu base64
    return Buffer.from(htmlPart.body.data, "base64").toString("utf-8");
  }

  return null;
}

// Ta méthode extractEmailWithStyles modifiée
export function extractEmailWithStyles(rawEmailHtml: string) {
  const cheerio = require("cheerio");
  const $ = cheerio.load(rawEmailHtml);

  // Extraire les styles du <head>
  const styles = $("head style").html() || "";

  // Extraire le body ou tout le contenu si pas de body
  const bodyContent = $("body").html() || rawEmailHtml;

  return {
    html: bodyContent,
    css: styles,
    hasExternalStyles: styles.length > 0,
  };
}
