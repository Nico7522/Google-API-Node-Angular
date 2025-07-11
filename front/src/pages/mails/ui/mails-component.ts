import { Component, effect, inject, OnInit } from '@angular/core';
import { MailsService } from '../api/mails-service';
import { UserService } from '../../../shared/models/user/user-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-mails-component',
  imports: [DatePipe],
  templateUrl: './mails-component.html',
  styleUrl: './mails-component.scss',
})
export class MailsComponent implements OnInit {
  #mailsService = inject(MailsService);
  #userService = inject(UserService);

  mails = this.#mailsService.mails.value;
  ngOnInit() {
    console.log(this.#userService.userInfo()?.userId);
    // Initialization logic for the MailsComponent can go here
    this.#mailsService.userId.set(this.#userService.userInfo()?.userId || '');
  }
}
