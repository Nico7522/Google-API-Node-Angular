import cheerio from "cheerio";

// Côté Node.js - extraction complète
export function extractHtmlFromMessage(message: any): string | null {
  function findHtmlPart(payload: any): any {
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

  const htmlPart = findHtmlPart(message.payload);

  if (htmlPart && htmlPart.body.data) {
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
