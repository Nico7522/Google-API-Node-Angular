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
  /**
   * The authorization code received from Google.
   * This code is used to exchange for access tokens.
   */
  code = input.required<string>();

  ngOnInit() {
    this.#googleAuthService.getAccessTokens(this.code()).subscribe();
  }
}
