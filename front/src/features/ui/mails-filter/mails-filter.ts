import { Component, inject, input } from '@angular/core';
import { MailsFilterService } from '../../models/mails-filter/mails-filter-service';

@Component({
  selector: 'app-mails-filter',
  templateUrl: './mails-filter.html',
  styleUrl: './mails-filter.scss',
})
export class MailsFilter {
  readonly #filterService = inject(MailsFilterService);
  isLoading = input.required<boolean>();
  unreadOnly = this.#filterService.unreadOnly;
  searchText = this.#filterService.searchText;
  onToggleUnread = () => this.#filterService.toggleUnreadOnly();
  onSearchButtonClick = (value: string) => this.#filterService.setSearchText(value);
}
