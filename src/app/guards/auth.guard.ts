import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthRepository } from '@app/state';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authRepository = inject(AuthRepository);

  const authDataAvailable = authRepository.getValue().idToken && authRepository.getValue().refreshToken;

  if (authDataAvailable) {
    router.navigateByUrl('/todos');
  }

  return !authDataAvailable;
};
