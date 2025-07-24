import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { MailsFilterService } from '../../models/mails-filter/mails-filter-service';
import { UserService } from '../../../shared/models/user/user-service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ErrorService } from '../../../shared/models/error/error-service';

@Injectable({
  providedIn: 'root',
})
export class AiChatService {
  readonly #mailsFilterService = inject(MailsFilterService);
  readonly #httpClient = inject(HttpClient);
  readonly #userService = inject(UserService);
  readonly #errorService = inject(ErrorService);
  #userPrompt = signal('');
  #userId = computed(() => this.#userService.userInfo()?.userId);
  #mails = computed(() => this.#mailsFilterService.filteredMails().map(mail => mail.id));
  filteredMailsByIA = rxResource({
    params: () => ({ userPrompt: this.#userPrompt(), userId: this.#userId() }),
    stream: ({ params }) =>
      this.#userPrompt()
        ? this.#httpClient
            .post<{ mailIds: string[] }>(`${environment.API_URL}/api/gmail/users/${params.userId}/messages/ai`, {
              userPrompt: params.userPrompt,
              messageIds: this.#mails(),
            })
            .pipe(
              tap(res => this.#mailsFilterService.setFilteredByIAMailIds(res.mailIds)),
              tap(() => this.#userPrompt.set('')),
              catchError(err => {
                this.#userPrompt.set('');
                this.#errorService.setError({
                  error: 'Analyse échouée',
                  code: err.status ?? 500,
                  message: "Une erreur est survenue lors de l'analyse des emails",
                });
                return of({ mailIds: [] });
              })
            )
        : of({ mailIds: [] }),
    defaultValue: { mailIds: [] },
  });

  setUserPrompt(userPrompt: string) {
    this.#userPrompt.set(userPrompt);
  }
}
