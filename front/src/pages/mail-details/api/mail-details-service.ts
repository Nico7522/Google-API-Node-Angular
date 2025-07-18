import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserService } from '../../../shared/models/user/user-service';
import { Mail } from '../../../entities/mail/models/interfaces/mail-interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import { ErrorService } from '../../../shared/models/error/error-service';

@Injectable({
  providedIn: 'root',
})
export class MailDetailsService {
  readonly #httpClient = inject(HttpClient);
  readonly #errorService = inject(ErrorService);
  readonly #userService = inject(UserService);
  #mailId = signal<string>('');

  mailDetails = rxResource({
    params: () => ({
      userId: this.#userService.userInfo()?.userId,
      mailId: this.#mailId(),
    }),
    stream: ({ params }) =>
      this.#httpClient.get<Mail>(`${environment.API_URL}/api/gmail/users/${params.userId}/messages/${params.mailId}`).pipe(
        tap(res => console.log(res)),
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

  setMailId(mailId: string) {
    this.#mailId.set(mailId);
  }
}
