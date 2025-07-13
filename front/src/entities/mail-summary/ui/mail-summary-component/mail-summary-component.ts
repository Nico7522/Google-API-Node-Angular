import { Component, input } from '@angular/core';
import { MailSummary } from '../../models/interfaces/mail-summary-interface';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mail-summary-component',
  imports: [DatePipe, RouterModule],
  templateUrl: './mail-summary-component.html',
  styleUrl: './mail-summary-component.scss',
})
export class MailSummaryComponent {
  mail = input.required<MailSummary>();
}
