import OpenAI from "openai";
import { AiRepository } from "../repositories/ai-repository";
import { Service } from "typedi";

@Service()
export class AiService implements AiRepository {
  askAI = async (userPrompt: string, emails: any[]): Promise<string[]> => {
    const emailsContext = emails
      .map(
        (email, index) =>
          `Email ${index + 1}:
  ID: ${email.mailId}
  Sujet: ${email.subject}
  Contenu: ${email.body}
  ---`
      )
      .join("\n\n");

    const prompt = `Tu es un assistant qui analyse des emails. Je vais te donner une liste d'emails et une requête de recherche.

Tu dois analyser chaque email et retourner UNIQUEMENT les IDs des emails qui correspondent EXACTEMENT à la requête.

IMPORTANT: 
- Réponds UNIQUEMENT avec les IDs des emails correspondants, mets les dans un tableau
- Si aucun email ne correspond, réponds "[]"
- Ne donne aucune explication, juste les IDs
- Sois précis dans ton analyse

Requête de recherche: "${userPrompt}"

Emails à analyser:
${emailsContext}

Réponse (IDs seulement):`;
    const openai = new OpenAI({
      baseURL: process.env.OPEN_ROUTER_API_URL,
      apiKey: process.env.API_KEY,
    });
    const response = await openai.chat.completions.create({
      model: "qwen/qwen3-235b-a22b-07-25:free",
      messages: [{ role: "user", content: prompt }],
    });
    return JSON.parse(response.choices[0].message.content ?? "[]");
  };
}
