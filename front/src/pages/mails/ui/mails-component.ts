import { Component, computed, inject } from '@angular/core';
import { MailsService } from '../api/mails-service';
import { MailSummaryComponent } from '../../../entities/mail-summary/ui/mail-summary-component/mail-summary-component';
import { LoadingComponent } from '../../../shared/ui/loading-component/loading-component';
import { MailsFilter } from '../../../features/ui/mails-filter/mails-filter';
import { MailsFilterService } from '../../../features/models/mails-filter/mails-filter-service';

@Component({
  selector: 'app-mails-component',
  imports: [MailSummaryComponent, LoadingComponent, MailsFilter],
  templateUrl: './mails-component.html',
  styleUrl: './mails-component.scss',
})
export class MailsComponent {
  readonly #mailsService = inject(MailsService);
  readonly #mailsFilterService = inject(MailsFilterService);
  isLoading = computed(() => this.#mailsService.mails.isLoading());
  hasData = computed(() => this.#mailsService.mails.status() === 'resolved');
  filteredMails = this.#mailsFilterService.filteredMails;

  refreshMails() {
    this.#mailsService.mails.reload();
  }

  getNextMail() {
    this.#mailsService.getNextMail();
  }

  getPreviousMail() {
    this.#mailsService.getPreviousMail();
  }
}
