import { Component, inject, signal } from '@angular/core';
import { GoogleAuthService } from '../../../shared/api/google-auth/google-auth-service';
import { UserService } from '../../../shared/models/user/user-service';
import { ErrorService } from '../../../shared/models/error/error-service';
import { RouterModule } from '@angular/router';
import { finalize, tap } from 'rxjs';
@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss',
})
export class HomeComponent {
  #googleAuthService = inject(GoogleAuthService);
  #userService = inject(UserService);
  #errorService = inject(ErrorService);
  error = this.#errorService.error;
  isLoading = signal(false);
  login() {
    // Trigger request for sign in.
    this.isLoading.set(true);
    this.#googleAuthService.signInWithGoogle().subscribe({
      next(data) {
        window.location.href = data.authUrl;
      },
    });
  }

  logout() {
    this.#googleAuthService
      .logout(this.#userService.userInfo()?.id || '')
      .pipe(
        tap(() => this.isLoading.set(true)),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe();
  }
  user = this.#userService.userInfo;
}
