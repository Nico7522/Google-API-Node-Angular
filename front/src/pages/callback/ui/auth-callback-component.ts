import { Component, inject, input, OnInit } from '@angular/core';
import { GoogleAuthService } from '../../../shared/api/google-auth/google-auth-service';
import { RouterModule } from '@angular/router';
import { ErrorService } from '../../../shared/models/error/error-service';

@Component({
  selector: 'app-auth-callback-component',
  imports: [RouterModule],
  templateUrl: './auth-callback-component.html',
  styleUrl: './auth-callback-component.scss',
})
export class AuthCallbackComponent implements OnInit {
  readonly #googleAuthService = inject(GoogleAuthService);
  readonly #errorService = inject(ErrorService);
  /**
   * The authorization code received from Google.
   * This code is used to exchange for access tokens.
   */
  code = input.required<string>();
  /**
   * Property to access the error state from the ErrorService.
   */
  error = this.#errorService.error;

  ngOnInit() {
    /**
     * Echange the authorization code for access tokens.
     */
    this.#googleAuthService.getAccessTokens(this.code()).subscribe();
  }
}
