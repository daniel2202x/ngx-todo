import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { catchError, switchMap, throwError } from 'rxjs';

import { IS_DATABASE_REQUEST, AuthService } from '@app/services';
import { AuthRepository } from '@app/state';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authRepository = inject(AuthRepository);

  // only intercept requests pertaining to data, not stuff like auth
  const isDatabaseRequest = req.context.get(IS_DATABASE_REQUEST);
  if (isDatabaseRequest) {
    const reqWithHeaders = () => req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + authRepository.getValue().idToken) });

    const refresh$ = authService.refresh().pipe(catchError(error => {
      // in case the refresh token itself is invalid, shouldn't occur 99% of the time, only if a major account change
      // was done for the user like changing a password (in such case the user would have to log in again anyway)
      authService.logout(true);
      return throwError(() => error);
    }));

    return next(reqWithHeaders()).pipe(catchError(error => {
      if (error.status === 401) {
        // idToken expired: refresh the token, then proceed as usual
        return refresh$.pipe(switchMap(() => next(reqWithHeaders())));
      }

      return throwError(() => error);
    }));
  }

  return next(req);
};
