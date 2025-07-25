import { Component, computed, inject, signal } from '@angular/core';
import { MailsService } from '../../../features/api/mails-filter/mails-service';
import { MailSummaryComponent } from '../../../entities/mail-summary/ui/mail-summary-component/mail-summary-component';
import { LoadingComponent } from '../../../shared/ui/loading-component/loading-component';
import { MailsFilter } from '../../../features/ui/mails-filter/mails-filter';
import { MailsFilterService } from '../../../features/models/mails-filter/mails-filter-service';
import { AiChatComponent } from '../../../features/ui/ai-chat/ai-chat-component';
import { AiChatService } from '../../../features/api/ai-chat/ai-chat-service';

@Component({
  selector: 'app-mails-component',
  imports: [MailSummaryComponent, LoadingComponent, MailsFilter, AiChatComponent],
  templateUrl: './mails-component.html',
  styleUrl: './mails-component.scss',
})
export class MailsComponent {
  readonly #mailsService = inject(MailsService);
  readonly #mailsFilterService = inject(MailsFilterService);
  readonly #aiChatService = inject(AiChatService);
  isLoading = computed(() => this.#mailsService.mails.isLoading() || this.#aiChatService.filteredMailsByIA.isLoading());
  loadingMessage = computed(() => (this.#aiChatService.filteredMailsByIA.isLoading() ? 'Analyse en cours...' : 'Chargement des emails...'));
  hasData = computed(() => this.#mailsService.mails.status() === 'resolved');
  filteredMails = this.#mailsFilterService.filteredMails;
  isFirstPage = this.#mailsService.isFirstPage;

  openIAChat = signal(false);

  refreshMails() {
    this.#mailsService.reloadMails();
    this.#mailsFilterService.resetFilteredMailsByIA();
  }

  getNextMail() {
    this.#mailsService.getNextMail();
  }

  getPreviousMail() {
    this.#mailsService.getPreviousMail();
  }

  askIA() {
    this.openIAChat.set(true);
  }

  onCloseDialog() {
    this.openIAChat.set(false);
  }
}
