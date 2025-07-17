import { computed, inject, Injectable, signal } from '@angular/core';
import { MailsService } from '../../../pages/mails/api/mails-service';

@Injectable({
  providedIn: 'root',
})
export class MailsFilterService {
  #unreadOnly = signal(false);
  unreadOnly = this.#unreadOnly.asReadonly();
  #mailsService = inject(MailsService);

  toggleUnreadOnly() {
    this.#unreadOnly.update(value => !value);
  }

  filteredMails = computed(() => {
    const mails = this.#mailsService.mails.value()?.messages ?? [];
    return this.#unreadOnly() ? mails.filter(m => !m.read) : mails;
  });
}
