import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { OfflineService } from '@app/services';

import { catchError, tap, throwError } from 'rxjs';

export const offlineInterceptor: HttpInterceptorFn = (req, next) => {
  const offlineService = inject(OfflineService);

  return next(req).pipe(
    tap(() => offlineService.isOffline.set(false)),
    catchError(error => {

      // response status 0 means network error
      if (error.status === 0) {
        offlineService.isOffline.set(true);
      }

      return throwError(() => error);
    })
  );
};
