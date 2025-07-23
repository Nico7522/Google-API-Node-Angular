import { computed, inject, Injectable, signal } from '@angular/core';
import { of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { MailsFilterService } from '../../models/mails-filter/mails-filter-service';
import { UserService } from '../../../shared/models/user/user-service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AiChatService {
  readonly #mailsFilterService = inject(MailsFilterService);
  readonly #httpClient = inject(HttpClient);
  readonly #userService = inject(UserService);
  #userPrompt = signal('');
  #userId = computed(() => this.#userService.userInfo()?.userId);
  #mails = computed(() => this.#mailsFilterService.filteredMails().map(mail => mail.id));
  filteredMailsByIA = rxResource({
    params: () => ({ userPrompt: this.#userPrompt(), userId: this.#userId() }),
    stream: ({ params }) =>
      this.#userPrompt()
        ? this.#httpClient
            .post<{ filteredMails: string[] }>(`${environment.API_URL}/api/gmail/users/${params.userId}/messages/ai`, {
              userPrompt: params.userPrompt,
              messageIds: this.#mails(),
            })
            .pipe(tap(res => this.#mailsFilterService.setFilteredByIAMailIds(res.filteredMails)))
        : of({ filteredMails: [] }),
    defaultValue: { filteredMails: [] },
  });

  setUserPrompt(userPrompt: string) {
    this.#userPrompt.set(userPrompt);
  }
}
