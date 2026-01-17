import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const publicGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Validamos el token
  const valid = await authService.isTokenValid();

  if (valid) {
    // Si ya está logueado, redirigimos al home
    router.navigate(['/app/home']);
    return false;
  }

  // Si no está logueado, dejamos pasar
  return true;
};
