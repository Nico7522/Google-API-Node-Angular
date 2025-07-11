import { Component, inject } from '@angular/core';
import { GoogleAuthService } from '../../../shared/api/google-auth/google-auth-service';
import { UserService } from '../../../shared/models/user/user-service';
import { ErrorService } from '../../../shared/models/error/error-service';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-home-component',
  imports: [RouterModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss',
})
export class HomeComponent {
  #googleAuthService = inject(GoogleAuthService);
  #userService = inject(UserService);
  #errorService = inject(ErrorService);
  error = this.#errorService.error;
  login() {
    // Trigger request for sign in.
    this.#googleAuthService.signInWithGoogle().subscribe({
      next(data) {
        window.location.href = data.authUrl;
      },
    });
  }

  logout() {
    this.#googleAuthService
      .logout(this.#userService.userInfo()?.id || '')
      .subscribe();
  }
  user = this.#userService.userInfo;
}
