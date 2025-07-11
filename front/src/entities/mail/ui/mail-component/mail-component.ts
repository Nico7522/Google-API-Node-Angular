import { Component, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Mail } from '../../models/interfaces/mail-interface';

@Component({
  selector: 'app-mail-component',
  imports: [CommonModule, DatePipe],
  templateUrl: './mail-component.html',
  styleUrls: ['./mail-component.scss'],
})
export class MailComponent {
  mail = input.required<Mail>();
}
