import { Component, input } from '@angular/core';
import { MailSummary } from '../../models/interfaces/mail-summary-interface';
import { RouterModule } from '@angular/router';
import { ToFrenchDatePipe } from '../../../../shared/ui/pipes/to-french-date-pipe';

@Component({
  selector: 'app-mail-summary-component',
  imports: [ToFrenchDatePipe, RouterModule],
  templateUrl: './mail-summary-component.html',
  styleUrl: './mail-summary-component.scss',
})
export class MailSummaryComponent {
  mail = input.required<MailSummary>();
}
