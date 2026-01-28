import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('loggedUserToken');

  // 1. Clonamos la petición para añadir el token si existe
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `${token}`
      }
    });
  }

  // 2. Pasamos la petición y manejamos errores de forma centralizada
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el servidor responde que el token no vale (401 o 403)
      if (error.status === 401 || error.status === 403) {
        console.warn('Sesión inválida. Limpiando datos y redirigiendo...');
        
        localStorage.removeItem('loggedUserToken');
        localStorage.removeItem('loggedUser');
        
        router.createUrlTree(['/app']);
      }
      return throwError(() => error);
    })
  );
};