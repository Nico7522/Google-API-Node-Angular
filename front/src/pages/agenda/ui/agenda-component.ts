import { Component, inject, OnInit } from '@angular/core';
import { AgendaService } from '../api/agenda-service';
import { UserService } from '../../../shared/models/user/user-service';

@Component({
  selector: 'app-agenda-component',
  imports: [],
  templateUrl: './agenda-component.html',
  styleUrl: './agenda-component.scss',
})
export class AgendaComponent implements OnInit {
  #agendaService = inject(AgendaService);
  #userService = inject(UserService);
  ngOnInit(): void {
    this.#agendaService.setUserId(this.#userService.userInfo()?.userId ?? '');
  }
}
