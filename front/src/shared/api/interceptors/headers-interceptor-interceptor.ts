import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '../../models/user/user-service';

export const headersInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);
  const headers = new HttpHeaders({
    userId: userService.userInfo()?.userId || '',
  });

  const newReq = req.clone({
    headers,
  });
  return next(newReq);
};
