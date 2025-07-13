import { Component, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Mail } from '../../models/interfaces/mail-interface';
import { MailDetails } from '../../../../pages/mails/models/interfaces/mail-details-interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mail-component',
  imports: [CommonModule, DatePipe, RouterModule],
  templateUrl: './mail-component.html',
  styleUrls: ['./mail-component.scss'],
})
export class MailComponent {
  mail = input.required<Mail>();
}
