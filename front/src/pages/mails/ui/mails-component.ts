import { Component, computed, inject, OnInit } from '@angular/core';
import { MailsService } from '../api/mails-service';
import { UserService } from '../../../shared/models/user/user-service';
import { MailSummaryComponent } from '../../../entities/mail-summary/ui/mail-summary-component/mail-summary-component';
import { LoadingComponent } from '../../../shared/ui/loading-component/loading-component';

@Component({
  selector: 'app-mails-component',
  imports: [MailSummaryComponent, LoadingComponent],
  templateUrl: './mails-component.html',
  styleUrl: './mails-component.scss',
})
export class MailsComponent implements OnInit {
  #mailsService = inject(MailsService);
  #userService = inject(UserService);
  isLoading = computed(() => this.#mailsService.mails.isLoading());
  hasData = computed(() => this.#mailsService.mails.status() === 'resolved');
  hasError = computed(() => this.#mailsService.mails.status() === 'error');
  mails = this.#mailsService.mails.value;

  refreshMails() {
    this.#mailsService.mails.reload();
  }

  ngOnInit() {
    this.#mailsService.setUserId(this.#userService.userInfo()?.userId || '');
  }
}
