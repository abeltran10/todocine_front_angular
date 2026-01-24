import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isTokenValid().pipe(
    map(valid => {
      if (!valid) router.navigate(['/app']);
      return valid;
    }),
    catchError(() => {
      router.navigate(['/app']);
      return of(false);
    })
  );
};


