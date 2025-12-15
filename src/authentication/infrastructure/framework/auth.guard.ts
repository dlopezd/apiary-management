import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AUTHENTICATION_SERVICE } from './auth.token';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AUTHENTICATION_SERVICE);
  const router = inject(Router);
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    await router.navigate(['/auth/login']);
    return false;
  }

  return true;
};
