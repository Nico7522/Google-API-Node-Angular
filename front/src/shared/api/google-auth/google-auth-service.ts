import { httpResource } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { ApiResponse } from '../../models/api-response-model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  signInWithGoogle = signal(false);
  signIn = httpResource<{ authUrl: string }>(() =>
    this.signInWithGoogle() ? `${environment.API_URL}/auth/google` : undefined
  );

  authorizationCode = signal('');
  // Better using observable in order to raact when we receive the response, and set the user information to userInfo signal in userService.
  getAccessToken = httpResource<ApiResponse>(() =>
    this.authorizationCode()
      ? `${
          environment.API_URL
        }/auth/google/callback?code=${this.authorizationCode()}`
      : undefined
  );
}
