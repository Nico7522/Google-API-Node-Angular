import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorComponent } from '../shared/ui/error-component/error-component';
import { GoogleAuthService } from '../shared/api/google-auth/google-auth-service';
import { UserService } from '../shared/models/user/user-service';
import { HeaderComponent } from '../shared/ui/header-component/header-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ErrorComponent, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly #googleAuthService = inject(GoogleAuthService);
  #userId = inject(UserService).userInfo()?.userId;
  protected title = 'front';

  constructor() {
    this.#getUserStatus();
  }

  #getUserStatus() {
    if (this.#userId) {
      this.#googleAuthService.getStatus(this.#userId);
    }
  }
}
