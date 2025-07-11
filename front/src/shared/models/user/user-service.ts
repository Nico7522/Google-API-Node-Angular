import { computed, Injectable, signal } from '@angular/core';
import { UserInfo } from '../interfaces/user-interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  #userInfo = signal<UserInfo | null>(this._getUserInfoFromStorage());
  userInfo = computed<UserInfo | null>(() => this.#userInfo());
  private _getUserInfoFromStorage(): UserInfo | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as UserInfo;
    } catch {
      return null;
    }
  }
  setUserInfo(user: UserInfo | null): void {
    this.#userInfo.set(user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }
}
