import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';
import { catchError, map, of, switchMap } from 'rxjs';
import { ErrorService } from '../../../shared/models/error/error-service';
import { CalendarEvent } from '../../../entities/calendar-event/models/interfaces/calendar-event-interface';
import { UserService } from '../../../shared/models/user/user-service';

@Injectable({
  providedIn: 'root',
})
export class AgendaService {
  readonly #httpClient = inject(HttpClient);
  readonly #userService = inject(UserService);
  readonly #errorService = inject(ErrorService);

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
