import { Component, input } from '@angular/core';
import { CalendarEvent } from '../../models/interfaces/calendar-event-interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-calendar-event-component',
  imports: [DatePipe],
  templateUrl: './calendar-event-component.html',
  styleUrl: './calendar-event-component.scss',
})
export class CalendarEventComponent {
  event = input.required<CalendarEvent>();
}
