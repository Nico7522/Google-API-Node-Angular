import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../../models/api-response-model';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { UserService } from '../user/user-service';
@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  #httpClient = inject(HttpClient);
  #userService = inject(UserService);
  /**
   * Sign in with Google.
   * This method triggers a request to the backend to get the Google authentication URL.
   * @returns An observable that emits the API response containing the authentication URL.
   */
  signInWithGoogle(): Observable<{ authUrl: string }> {
    return this.#httpClient.post<{ authUrl: string }>(
      `${environment.API_URL}/auth/google`,
      {}
    );
  }

  /**
   * Get access tokens using the authorization code.
   * This method exchanges the authorization code for access tokens.
   * @param authorizationCode The authorization code received from Google.
   * @returns An observable that emits the API response containing user information and tokens.
   */
  getAccessTokens(authorizationCode: string): Observable<ApiResponse> {
    return this.#httpClient
      .get<ApiResponse>(
        `${environment.API_URL}/auth/google/callback?code=${authorizationCode}`
      )
      .pipe(
        tap((response) => {
          this.#userService.setUserInfo(response.user);
        })
      );
  }

  /**
   * This method sends a request to the backend to log out the user.
   * @param userId The ID of the user to log out.
   * @returns
   */
  logout(userId: string) {
    return this.#httpClient
      .post(`${environment.API_URL}/auth/logout/${userId}`, {})
      .pipe(
        tap(() => {
          this.#userService.setUserInfo(null);
        })
      );
  }
}
