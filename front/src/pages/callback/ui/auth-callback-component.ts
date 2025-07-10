import { Component, computed, effect, inject, input } from '@angular/core';
import { GoogleAuthService } from '../../../shared/api/google-auth/google-auth-service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-callback-component',
  imports: [RouterModule],
  templateUrl: './auth-callback-component.html',
  styleUrl: './auth-callback-component.scss',
})
export class AuthCallbackComponent {
  #googleAuthService = inject(GoogleAuthService);
  error = computed(() => this.#googleAuthService.getAccessToken.error());
  success = computed(
    () => this.#googleAuthService.getAccessToken.status() === 'resolved'
  );
  code = input.required<string>();

  ngOnInit() {
    // Trigger request for echange authorization code for access token.
    this.#googleAuthService.authorizationCode.set(this.code());
  }
}
