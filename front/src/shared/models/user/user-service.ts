import { computed, Injectable, signal } from '@angular/core';
import { UserInfo } from '../interfaces/user-interface';

/**
 * Service to manage user information and persistence in local storage.
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  /**
   * Private signal that holds the current user's information.
   * Initialized from local storage.
   */
  #userInfo = signal<UserInfo | null>(this._getUserInfoFromStorage());
  /**
   * Public computed signal to get the current user's information.
   */
  userInfo = computed<UserInfo | null>(() => this.#userInfo());
  /**
   * Retrieves user information from local storage.
   * @returns The user information if found and valid, otherwise null.
   */
  private _getUserInfoFromStorage(): UserInfo | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as UserInfo;
    } catch {
      return null;
    }
  }
  /**
   * Sets the user information in the service and persists it to local storage.
   * @param user The user information to set, or null to clear it.
   */
  setUserInfo(user: UserInfo | null): void {
    this.#userInfo.set(user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }
}
