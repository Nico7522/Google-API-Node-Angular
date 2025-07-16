import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorService } from '../../models/error/error-service';

@Component({
  selector: 'app-error-component',
  imports: [CommonModule],
  templateUrl: './error-component.html',
  styleUrls: ['./error-component.scss'],
})
export class ErrorComponent {
  #errorService = inject(ErrorService);
  error = this.#errorService.error;

  close() {
    this.#errorService.setError(null);
  }
}
