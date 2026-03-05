import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('loggedUserToken');

  const user = localStorage.getItem('loggedUser'); 
    
  const userRole = user ? JSON.parse(user).rol : null;

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


