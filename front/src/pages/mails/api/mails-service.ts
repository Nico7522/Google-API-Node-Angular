import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, EMPTY } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MailSummary } from '../../../entities/mail-summary/models/interfaces/mail-summary-interface';
import { ErrorService } from '../../../shared/models/error/error-service';
import { UserService } from '../../../shared/models/user/user-service';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MailsService {
  readonly #httpClient = inject(HttpClient);
  readonly #errorService = inject(ErrorService);
  readonly #userService = inject(UserService);
  readonly #router = inject(Router);
  readonly #activatedRoute = inject(ActivatedRoute);
  #pageToken = signal<string | undefined>(this.#activatedRoute.snapshot.queryParamMap.get('pageToken') ?? undefined);
  #searchQuery = signal<string | undefined>('');
  #previousPageTokens: (string | undefined)[] = [];

  nextPageToken = computed(() => this.mails.value()?.nextPageToken);
  isFirstPage = computed(() => (this.#pageToken() ? true : false));
  mails = rxResource({
    params: () => ({
      userId: this.#userService.userInfo()?.userId,
      pageToken: this.#pageToken(),
      searchQuery: this.#searchQuery(),
    }),
    stream: ({ params }) => {
      const baseUrl = `${environment.API_URL}/api/gmail/users/${params.userId}/messages`;
      const urlParams = new URLSearchParams();
      if (params.searchQuery) urlParams.set('search', params.searchQuery);
      if (params.pageToken) urlParams.set('pageToken', params.pageToken);
      const url = urlParams.toString() ? `${baseUrl}?${urlParams}` : baseUrl;
      return this.#httpClient.get<{ messages: MailSummary[]; nextPageToken: string }>(url).pipe(
        catchError(error => {
          this.#errorService.setError({
            code: error.status,
            error: 'Something went wrong',
            message: 'An error occurred while fetching mails.',
          });
          return EMPTY;
        })
      );
    },
  });

  getNextMail() {
    const currentNextToken = this.nextPageToken();
    if (currentNextToken) {
      this.#updateQueryParams({ pageToken: currentNextToken });
      this.#previousPageTokens.push(this.#pageToken());
      this.#pageToken.set(currentNextToken);
    }
  }

  getPreviousMail() {
    if (this.#previousPageTokens.length > 0) {
      const prevToken = this.#previousPageTokens.pop();
      this.#updateQueryParams({ pageToken: prevToken ?? null });
      this.#pageToken.set(prevToken);
    }
  }

  setSearchQuery(query: string) {
    this.#searchQuery.set(query);
    this.#updateQueryParams({ search: query === '' ? null : query });
  }

  #updateQueryParams(queryParams: Record<string, string | null>) {
    this.#router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
