import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, of, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MailSummary } from '../../../entities/mail-summary/models/interfaces/mail-summary-interface';
import { ErrorService } from '../../../shared/models/error/error-service';
import { UserService } from '../../../shared/models/user/user-service';

@Injectable({
  providedIn: 'root',
})
export class MailsService {
  readonly #httpClient = inject(HttpClient);
  readonly #errorService = inject(ErrorService);
  readonly #userService = inject(UserService);

  mails = rxResource({
    params: () => ({
      userId: this.#userService.userInfo()?.userId,
    }),
    stream: ({ params }) => {
      if (!params.userId) {
        return of([]);
      }
      return this.#httpClient
        .get<{ messages: MailSummary[]; total: number }>(`${environment.API_URL}/api/gmail/users/${params.userId}/messages`)
        .pipe(
          map(response => response.messages || []),
          catchError(error => {
            this.#errorService.setError({
              code: error.status,
              error: 'Something went wrong',
              message: 'An error occurred while fetching mails.',
            });
            return of([]);
          })
        );
    },
  });
}
