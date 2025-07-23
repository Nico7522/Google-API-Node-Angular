import { Injectable } from '@angular/core';
import ollama from 'ollama';

@Injectable({
  providedIn: 'root',
})
export class AiChatService {
  async sendMessage(userPrompt: string) {
    const systemPrompt = 'You are a helpful assistant that read the emails and return only the emails that match my requirements.';
    const response = await ollama.chat({
      model: 'llama3.1:8b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });
    return response.message.content;
  }
}
