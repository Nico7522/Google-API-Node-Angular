import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toFrenchDate',
})
export class ToFrenchDatePipe implements PipeTransform {
  transform(date: string): string {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.toLocaleString('fr-FR', { month: 'long' });
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const newDate = `${day} ${month} ${year} ${hours}:${minutes}h`;

    return newDate;
  }
}
