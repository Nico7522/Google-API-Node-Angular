import { Injectable, signal } from '@angular/core';
import { ErrorResponse } from '../interfaces/error-interface';

/**
 * Service to manage and provide access to application-wide error state.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  /**
   * Private signal that holds the current error response.
   * It can be null if there is no error.
   */
  #error = signal<ErrorResponse | null>(null);
  /**
   * Public readonly signal for components to react to error changes.
   */
  error = this.#error.asReadonly();

  /**
   * Sets or clears the current error.
   * @param error The error response to set, or null to clear the error.
   */
  setError(error: ErrorResponse | null): void {
    this.#error.set(error);
  }
}
