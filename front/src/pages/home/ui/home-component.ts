import { Component, effect, inject } from '@angular/core';
import { GoogleAuthService } from '../../../shared/api/google-auth/google-auth-service';
import { UserService } from '../../../shared/api/user/user-service';
@Component({
  selector: 'app-home-component',
  imports: [],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss',
})
export class HomeComponent {
  #googleAuthService = inject(GoogleAuthService);
  #userService = inject(UserService);
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
