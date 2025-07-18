import { Component, inject, input, OnInit } from '@angular/core';
import { MailComponent } from '../../../entities/mail/ui/mail-component/mail-component';
import { MailDetailsService } from '../api/mail-details-service';
import { LoadingComponent } from '../../../shared/ui/loading-component/loading-component';

@Component({
  selector: 'app-mail-details-component',
  imports: [MailComponent, LoadingComponent],
  templateUrl: './mail-details-component.html',
  styleUrl: './mail-details-component.scss',
})
export class MailDetailsComponent implements OnInit {
  readonly #mailDetailsService = inject(MailDetailsService);
  mailId = input.required<string>();
  mail = this.#mailDetailsService.mailDetails.value;

  status = this.#mailDetailsService.mailDetails.status;
  isError = this.#mailDetailsService.mailDetails.error;
  ngOnInit(): void {
    if (this.mailId()) {
      this.#mailDetailsService.setMailId(this.mailId());
    }
  }
}
