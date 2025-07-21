import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';
import { catchError, map, of, switchMap } from 'rxjs';
import { ErrorService } from '../../../shared/models/error/error-service';
import { CalendarEvent } from '../../../entities/calendar-event/models/interfaces/calendar-event-interface';
import { UserService } from '../../../shared/models/user/user-service';

@Injectable()
export class AgendaService {
  readonly #httpClient = inject(HttpClient);
  readonly #userService = inject(UserService);
  readonly #errorService = inject(ErrorService);

  /**
   * Fetches calendar events and public holidays for the current user.
   * It first fetches the user's calendar events, then fetches public holidays.
   * The two lists of events are then merged and sorted by their start date.
   * If an error occurs during the process, it is handled by the ErrorService,
   * and null is returned as the result.
   */
  canlendar = rxResource({
    params: () => ({ userId: this.#userService.userInfo()?.userId }),
    stream: ({ params }) => {
      return this.#httpClient.get<{ events: CalendarEvent[] }>(`${environment.API_URL}/api/calendar/users/${params.userId}/events`).pipe(
        switchMap(events => {
          return this.#httpClient.get<{ events: CalendarEvent[] }>(`${environment.API_URL}/api/calendar/users/${params.userId}/events/holidays`).pipe(
            map(holidays => {
              return [...holidays.events, ...events.events].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
            })
          );
        }),
        catchError(err => {
          this.#errorService.setError({
            code: err.status,
            message: 'Something went wrong while fetching calendar events',
            error: 'Please try again later.',
          });
          return of(null);
        })
      );
    },
  });
}
