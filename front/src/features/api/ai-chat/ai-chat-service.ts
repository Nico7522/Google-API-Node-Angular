import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import ollama from 'ollama';
import { rxResource } from '@angular/core/rxjs-interop';
import { MailSummary } from '../../../entities/mail-summary/models/interfaces/mail-summary-interface';
import { MailsFilterService } from '../../models/mails-filter/mails-filter-service';

@Injectable({
  providedIn: 'root',
})
export class AiChatService {
  #mailsFilterService = inject(MailsFilterService);
  #userPrompt = signal('');
  mails = computed(() => this.#mailsFilterService.filteredMails());

  #sendMessage(userPrompt: string, mails: MailSummary[]): Observable<string> {
    const systemPrompt =
      'You are a helpful assistant that read the emails and return only the emails that match my requirements. In your response, only give me the mail ID.';
    const bodyMail = mails.map(mail => `${mail.id} - ${mail.subject}`).join('\n');
    console.log(bodyMail);
    return from(
      ollama
        .chat({
          model: 'mistral',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt + bodyMail },
          ],
        })
        .then(response => response.message.content)
        .catch(error => {
          throw error;
        })
    );
  }

  setUserPrompt(userPrompt: string) {
    this.#userPrompt.set(userPrompt);
  }
  filteredMailsByIA = rxResource({
    params: () => ({ userPrompt: this.#userPrompt(), mails: this.mails() }),
    stream: ({ params }) => (this.#userPrompt() ? this.#sendMessage(params.userPrompt, params.mails) : of('')),
    defaultValue: '',
  });
}
