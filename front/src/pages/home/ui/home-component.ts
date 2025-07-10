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
    this.#googleAuthService.signInWithGoogle.set(true);
  }

  user = this.#userService.userInfo;
  constructor() {
    effect(() => {
      // When receiving the auth url, redirect to authorize.
      if (this.#googleAuthService.signIn.value()?.authUrl) {
        let url = this.#googleAuthService.signIn.value()?.authUrl;
        window.location.href = url as string;
      }
    });
  }
}
