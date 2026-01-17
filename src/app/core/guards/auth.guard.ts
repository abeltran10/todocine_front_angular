import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Validamos el token
  const valid = await authService.isTokenValid();

  if (!valid) {
    // Si no es válido, redirigimos al login
    router.navigate(['/app']);
    return false;
  }

  // Si es válido, dejamos pasar
  return true;
};

