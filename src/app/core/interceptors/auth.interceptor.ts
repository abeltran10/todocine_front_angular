import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Endpoints a excluir
  const excludedUrls = ['/app/login'];

  const isExcluded = excludedUrls.some(url => req.url.includes(url));

  if (isExcluded) {
    // Si está excluido, dejamos la petición tal cual
    return next(req);
  }

  // Token normal para todas las demás peticiones
  const token = localStorage.getItem('loggedUserToken');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: token
      }
    });
  }

  return next(req);
};

