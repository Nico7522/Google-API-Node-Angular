import { Component, computed, inject } from '@angular/core';
import { AgendaService } from '../api/agenda-service';
import { CalendarEventComponent } from '../../../entities/calendar-event/ui/calendar-event-component/calendar-event-component';
import { LoadingComponent } from '../../../shared/ui/loading-component/loading-component';

@Component({
  selector: 'app-agenda-component',
  imports: [CalendarEventComponent, LoadingComponent],
  providers: [AgendaService],
  templateUrl: './agenda-component.html',
  styleUrl: './agenda-component.scss',
})
export class AgendaComponent {
  readonly #agendaService = inject(AgendaService);
  isLoading = computed(() => this.#agendaService.canlendar.isLoading());
  hasData = computed(() => this.#agendaService.canlendar.status() === 'resolved');
  events = this.#agendaService.canlendar.value;
}
