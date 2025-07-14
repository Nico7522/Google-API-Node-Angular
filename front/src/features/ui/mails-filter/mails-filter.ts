import { Component, inject, Input } from '@angular/core';
import { MailsFilterService } from '../../models/mails-filter/mails-filter-service';

@Component({
  selector: 'app-mails-filter',
  templateUrl: './mails-filter.html',
  styleUrl: './mails-filter.scss',
})
export class MailsFilter {
  @Input() isLoading!: () => boolean;
  #filterService = inject(MailsFilterService);
  unreadOnly = this.#filterService.unreadOnly;
  onToggleUnread = () => this.#filterService.toggleUnreadOnly();
}
