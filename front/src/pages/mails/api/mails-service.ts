import { httpResource } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MailDetails } from '../models/interfaces/mail-details-interface';

@Injectable({
  providedIn: 'root',
})
export class MailsService {
  #userId = signal<string | null>(null);
  mails = httpResource<MailDetails[]>(
    () =>
      this.#userId()
        ? `${environment.API_URL}/api/gmail/users/${this.#userId()}/messages`
        : undefined,
    {
      defaultValue: [],
      parse: (value: unknown) => {
        const response = value as { messages: MailDetails[]; total: number };
        return response.messages || [];
      },
    }
  );

  setUserId(userId: string | null) {
    this.#userId.set(userId);
  }
}
