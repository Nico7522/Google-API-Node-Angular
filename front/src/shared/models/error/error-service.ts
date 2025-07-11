import { Injectable, signal } from '@angular/core';
import { ErrorResponse } from '../interfaces/error-interface';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  #error = signal<ErrorResponse | null>(null);
  error = this.#error.asReadonly();

  setError(error: ErrorResponse | null): void {
    this.#error.set(error);
  }
}
