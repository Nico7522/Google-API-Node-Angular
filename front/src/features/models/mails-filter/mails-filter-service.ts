import { computed, inject, Injectable, signal } from '@angular/core';
import { MailsService } from '../../api/mails-filter/mails-service';

@Injectable({
  providedIn: 'root',
})
export class MailsFilterService {
  readonly #mailsService = inject(MailsService);
  #unreadOnly = signal(false);
  unreadOnly = this.#unreadOnly.asReadonly();
  #searchText = signal('');
  searchText = this.#searchText.asReadonly();

  toggleUnreadOnly() {
    this.#unreadOnly.update(value => !value);
  }

  setSearchText(text: string) {
    console.log(text);

    this.#mailsService.setSearchQuery(text);
  }

  filteredMails = computed(() => {
    const mails = this.#mailsService.mails.value()?.messages ?? [];
    const filtered = this.#unreadOnly() ? mails.filter(m => !m.read) : mails;
    return filtered;
  });
}
