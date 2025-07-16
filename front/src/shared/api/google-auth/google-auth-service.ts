import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, EMPTY, Observable, tap } from 'rxjs';
import { UserService } from '../../models/user/user-service';
import { ApiResponse } from '../../models/interfaces/api-response-interface';
import { ErrorService } from '../../models/error/error-service';
import { rxResource } from '@angular/core/rxjs-interop';
@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  readonly #httpClient = inject(HttpClient);
  readonly #userService = inject(UserService);
  readonly #errorService = inject(ErrorService);
  /**
   * Sign in with Google.
   * This method triggers a request to the backend to get the Google authentication URL.
   * @returns An observable that emits the API response containing the authentication URL.
   */
  signInWithGoogle(): Observable<{ authUrl: string }> {
    return this.#httpClient.post<{ authUrl: string }>(`${environment.API_URL}/auth/google`, {}).pipe(
      catchError(error => {
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
    return this.#httpClient.get<ApiResponse>(`${environment.API_URL}/auth/google/callback?code=${authorizationCode}`).pipe(
      tap(response => {
        this.#userService.setUserInfo({
          ...response.user,
          userId: response.userId,
        });
      }),
      catchError(error => {
        this.#errorService.setError({
          code: error.status,
          error: 'Access Token recovery error.',
          message: 'An error occurred while retrieving access tokens.',
        });
        return EMPTY;
      })
    );
  }

  /**
   * This method sends a request to the backend to log out the user.
   * @param userId The ID of the user to log out.
   * @returns a observable with the logout state information
   */
  logout(userId: string): Observable<{ message: string }> {
    return this.#httpClient.post<{ message: string }>(`${environment.API_URL}/auth/logout/${userId}`, {}).pipe(
      tap(() => {
        this.#userService.setUserInfo(null);
      }),
      catchError(() => {
        this.#userService.setUserInfo(null);
        return EMPTY;
      })
    );
  }

  /**
   * This method get the current user status form the API.
   * @param userId
   * @returns a resource ref containing a boolean indicating if the user is authenticated.
   */
  getStatus(userId: string) {
    return rxResource({
      params: () => ({ userId: userId }),
      stream: ({ params }) => {
        return this.#httpClient.get<{ authenticated: boolean }>(`${environment.API_URL}/auth/status/${params.userId}`).pipe(
          tap(res => {
            if (!res.authenticated) this.#userService.setUserInfo(null);
          }),
          catchError(error => {
            this.#errorService.setError({
              code: error.status,
              error: "Can't get status.",
              message: 'Unable to get the current user status.',
            });
            return EMPTY;
          })
        );
      },
    });
  }
}
