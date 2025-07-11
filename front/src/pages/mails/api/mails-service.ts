import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Mail } from '../../../entities/mail/models/interfaces/mail-interface';

@Injectable({
  providedIn: 'root',
})
export class MailsService {
  #httpClient = inject(HttpClient);

  userId = signal<string | null>(null);
  mails = httpResource<Mail[]>(
    () => ({
      url: `${environment.API_URL}/api/gmail/messages/${this.userId()}`,
    }),
    {
      defaultValue: [],
      parse: (value: unknown) => {
        const response = value as { messages: Mail[]; total: number };
        return response.messages;
      },
    }
  );
}
