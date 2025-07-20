import { computed, inject, Injectable, signal } from '@angular/core';
import { MailsService } from '../../api/mails-filter/mails-service';

/**
 * Service to manage mail filtering logic, including unread-only toggle and search text.
 * Delegates mail fetching to MailsService and provides filtered mail list.
 */
@Injectable({
  providedIn: 'root',
})
export class MailsFilterService {
  readonly #mailsService = inject(MailsService);
  // Signal to track unread-only filter state
  #unreadOnly = signal(false);
  // Readonly signal for external use
  unreadOnly = this.#unreadOnly.asReadonly();
  // Signal to track the current search text
  #searchText = signal('');
  // Readonly signal for external use
  searchText = this.#searchText.asReadonly();

  /**
   * Computed property to return mails filtered by unread state.
   */
  filteredMails = computed(() => {
    const mails = this.#mailsService.mails.value()?.messages ?? [];
    const filtered = this.#unreadOnly() ? mails.filter(m => !m.read) : mails;
    return filtered;
  });
  /**
   * Toggle the unread-only filter state.
   */
  toggleUnreadOnly() {
    this.#unreadOnly.update(value => !value);
  }

  /**
   * Set the search text and update the mails service query.
   * @param text The search string to filter mails.
   */
  setSearchText(text: string) {
    console.log(text);
    this.#mailsService.setSearchQuery(text);
  }
}
