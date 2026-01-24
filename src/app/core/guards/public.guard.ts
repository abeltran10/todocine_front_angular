import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const publicGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isTokenValid().pipe(
    map(isValid => {
      if (isValid) {
        router.navigate(['/app/home']); // si ya está logueado, redirige a home
      }
      return true; // no logueado, permite acceder
    }),
    catchError(err => {
      console.error('Error comprobando acceso público', err);
      return of(true); // en caso de error, permite acceso público
    })
  );
};
