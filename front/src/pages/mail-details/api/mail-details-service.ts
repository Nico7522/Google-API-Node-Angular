import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserService } from '../../../shared/models/user/user-service';
import { Mail } from '../../../entities/mail/models/interfaces/mail-interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { ErrorService } from '../../../shared/models/error/error-service';

/**
 * Service to fetch the details of a specific mail.
 */
@Injectable({
  providedIn: 'root',
})
export class MailDetailsService {
  readonly #httpClient = inject(HttpClient);
  readonly #errorService = inject(ErrorService);
  readonly #userService = inject(UserService);
  #mailId = signal<string>('');

  /**
   * A reactive resource that fetches the details of a mail.
   * The stream is re-triggered when the user or mailId changes.
   */
  mailDetails = rxResource({
    params: () => ({
      userId: this.#userService.userInfo()?.userId,
      mailId: this.#mailId(),
    }),
    stream: ({ params }) =>
      this.#httpClient.get<Mail>(`${environment.API_URL}/api/gmail/users/${params.userId}/messages/${params.mailId}`).pipe(
        catchError(error => {
          this.#errorService.setError({
            code: error.status,
            error: 'Something went wrong',
            message: 'An error occurred while fetching mail details.',
          });
          return of(null);
        })
      ),
  });

  /**
   * Sets the ID of the mail to fetch.
   * @param mailId The ID of the mail.
   */
  setMailId(mailId: string) {
    this.#mailId.set(mailId);
  }
}
