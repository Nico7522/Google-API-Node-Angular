import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, EMPTY, Observable, tap } from 'rxjs';
import { UserService } from '../../models/user/user-service';
import { ApiResponse } from '../../models/interfaces/api-response-interface';
import { ErrorService } from '../../models/error/error-service';
@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  #httpClient = inject(HttpClient);
  #userService = inject(UserService);
  #errorService = inject(ErrorService);
  /**
   * Sign in with Google.
   * This method triggers a request to the backend to get the Google authentication URL.
   * @returns An observable that emits the API response containing the authentication URL.
   */
  signInWithGoogle(): Observable<{ authUrl: string }> {
    return this.#httpClient
      .post<{ authUrl: string }>(`${environment.API_URL}/auth/google`, {})
      .pipe(
        catchError((error) => {
          this.#errorService.setError({
            code: error.status,
            error: 'Semething went wrong',
            message: 'An error occurred while signing in with Google.',
          });
          return EMPTY;
        })
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
          this.#userService.setUserInfo({
            ...response.user,
            userId: response.userId,
          });
        }),
        catchError((error) => {
          this.#errorService.setError({
            code: error.status,
            error: 'Semething went wrong',
            message: 'An error occurred while retrieving access tokens.',
          });
          return EMPTY;
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
