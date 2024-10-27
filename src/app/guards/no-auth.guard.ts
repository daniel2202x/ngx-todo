import { inject } from '@angular/core';
import { CanActivateChildFn } from '@angular/router';

import { AuthService } from '@app/services';
import { AuthRepository } from '@app/state';

export const noAuthGuard: CanActivateChildFn = () => {
  const authService = inject(AuthService);
  const authRepository = inject(AuthRepository);

  const authDataAvailable = authRepository.getValue().idToken && authRepository.getValue().refreshToken;

  if (!authDataAvailable) {
    authService.logout();
  }

  return !!authDataAvailable;
};
