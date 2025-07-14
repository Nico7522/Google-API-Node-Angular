import { Component, computed, inject, OnInit } from '@angular/core';
import { MailsService } from '../api/mails-service';
import { UserService } from '../../../shared/models/user/user-service';
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
export class MailsComponent implements OnInit {
  #mailsService = inject(MailsService);
  #mailsFilterService = inject(MailsFilterService);
  #userService = inject(UserService);
  isLoading = computed(() => this.#mailsService.mails.isLoading());
  hasData = computed(() => this.#mailsService.mails.status() === 'resolved');
  hasError = computed(() => this.#mailsService.mails.status() === 'error');
  filteredMails = this.#mailsFilterService.filteredMails;

  refreshMails() {
    this.#mailsService.mails.reload();
  }

  ngOnInit() {
    this.#mailsService.setUserId(this.#userService.userInfo()?.userId || '');
  }
}
