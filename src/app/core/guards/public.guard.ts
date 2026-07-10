import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const publicGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const token = authService.token;
  
  return token ? router.navigate(['/app/home']) : true;
      
};
