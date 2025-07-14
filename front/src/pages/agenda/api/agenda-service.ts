import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';
import { catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AgendaService {
  #httpClient = inject(HttpClient);
  #userId = signal('');
  setUserId(userId: string) {
    this.#userId.set(userId);
  }
  canlendar = rxResource({
    params: () => ({ userId: this.#userId() }),
    stream: ({ params }) => {
      return this.#httpClient.get<{ authenticated: boolean }>(`${environment.API_URL}/api/calendar/events/${params.userId}`).pipe(
        tap(res => console.log(res)),
        catchError(err => {
          console.log(err);
          return of(null);
        })
      );
    },
  });
}
