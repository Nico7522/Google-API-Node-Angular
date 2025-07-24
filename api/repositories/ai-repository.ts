export interface AiRepository {
  askAI(userPrompt: string, emails: any[]): Promise<string[]>;
}
