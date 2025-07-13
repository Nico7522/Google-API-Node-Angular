import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorComponent } from '../shared/ui/error-component/error-component';
import { GoogleAuthService } from '../shared/api/google-auth/google-auth-service';
import { UserService } from '../shared/models/user/user-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ErrorComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'front';
  #userId = inject(UserService).userInfo()?.userId;
  #googleAuthService = inject(GoogleAuthService);

  constructor() {
    //this.#googleAuthService.getStatus(this.#userid ?? '');

    this.#getUserStatus();
  }

  #getUserStatus() {
    if (this.#userId) {
      this.#googleAuthService.getStatus(this.#userId);
    }
  }
}
