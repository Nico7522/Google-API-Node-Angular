import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, EMPTY } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MailSummary } from '../../../entities/mail-summary/models/interfaces/mail-summary-interface';
import { ErrorService } from '../../../shared/models/error/error-service';
import { UserService } from '../../../shared/models/user/user-service';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Service to manage fetching and paginating mails from the backend API.
 * Handles search, error reporting, and page navigation.
 */
@Injectable({
  providedIn: 'root',
})
export class MailsService {
  readonly #httpClient = inject(HttpClient);
  readonly #errorService = inject(ErrorService);
  readonly #userService = inject(UserService);
  readonly #router = inject(Router);
  readonly #activatedRoute = inject(ActivatedRoute);

  // Signal to track the current page token for pagination
  #pageToken = signal<string | undefined>(this.#activatedRoute.snapshot.queryParamMap.get('pageToken') ?? undefined);
  // Signal to track the current search query
  #searchQuery = signal<string | undefined>('');
  // Stack to keep track of previous page tokens for back navigation
  #previousPageTokens: (string | undefined)[] = [];

  // Computed property for the next page token from the mails resource
  nextPageToken = computed(() => this.mails.value()?.nextPageToken);
  // Computed property to check if the current page is the first page
  isFirstPage = computed(() => (this.#pageToken() ? true : false));

  /**
   * Resource to fetch mails from the backend API based on user, page, and search query.
   * Handles errors and updates error service on failure.
   */
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

  /**
   * Navigate to the next page of mails using the next page token.
   * Updates query params and tracks previous tokens for back navigation.
   */
  getNextMail() {
    const currentNextToken = this.nextPageToken();
    if (currentNextToken) {
      this.#updateQueryParams({ pageToken: currentNextToken });
      this.#previousPageTokens.push(this.#pageToken());
      this.#pageToken.set(currentNextToken);
    }
  }

  /**
   * Navigate to the previous page of mails using the previous page token stack.
   * Updates query params accordingly.
   */
  getPreviousMail() {
    if (this.#previousPageTokens.length > 0) {
      const prevToken = this.#previousPageTokens.pop();
      this.#updateQueryParams({ pageToken: prevToken ?? null });
      this.#pageToken.set(prevToken);
    }
  }

  /**
   * Set the search query for filtering mails and update query params.
   * @param query The search string to filter mails.
   */
  setSearchQuery(query: string) {
    this.#searchQuery.set(query);
    this.#updateQueryParams({ search: query === '' ? null : query });
  }

  /**
   * Reload the mails resource.
   */
  reloadMails() {
    this.mails.reload();
  }

  /**
   * Helper method to update the router's query parameters.
   * @param queryParams Key-value pairs for query params to update.
   */
  #updateQueryParams(queryParams: Record<string, string | null>) {
    this.#router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
