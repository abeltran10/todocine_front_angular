import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const token = authService.token;

  const user = authService.currentUser; 
    
  const userRole = user ? user.rol : '';

  if (!token) {
    return router.navigate(['/app']);
  }

  const expectedRoles = route.data['expectedRole'] as Array<string>;

  //Si la ruta tiene restricciones y el usuario no tiene el rol necesario
  if (expectedRoles && !expectedRoles.includes(userRole)) {
    // Redirigir a home o a una página de "No Autorizado"
    return router.navigate(['/app']); 
  }

  return true;

};


