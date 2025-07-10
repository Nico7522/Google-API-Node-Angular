import {
  computed,
  inject,
  Injectable,
  linkedSignal,
  signal,
} from '@angular/core';
import { GoogleAuthService } from '../google-auth/google-auth-service';
import { UserInfo } from '../../models/user-model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  #googleAuthService = inject(GoogleAuthService);

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
