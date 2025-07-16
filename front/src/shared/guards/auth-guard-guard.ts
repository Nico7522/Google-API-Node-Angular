import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../models/user/user-service';

export const authGuardGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.userInfo() === null) {
    router.navigate(['/']);
    return false;
  }
  return true;
};
