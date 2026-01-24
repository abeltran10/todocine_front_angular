import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, catchError, tap, map } from 'rxjs';
import { UserService } from './user.service';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private userService: UserService) {}  
  

  /**
   * Devuelve un Observable con el usuario actual validado desde el backend
   */
  getUser(): Observable<User | null> {
    // Si ya tenemos usuario en memoria, devolvemos un observable inmediato
    const loggedUser = localStorage.getItem('loggedUser');
    if (!loggedUser) return of(null);

    const user: User = JSON.parse(loggedUser);

    // Llamada al backend para validar token y obtener datos actualizados
    return this.userService.getUser(user.id).pipe(
      tap(response => {
        localStorage.setItem('loggedUser', JSON.stringify(response)); // Guardamos actualizado en localStorage
      }),
      catchError(err => {
        // En caso de error (token inválido)
        this.clearUser();
        return of(null);
      })
    );
  }

  /**
   * Elimina usuario y token de memoria y localStorage
   */
  clearUser(): void {
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('loggedUserToken');
  }

  /**
   * Devuelve un Observable<boolean> indicando si el token es válido
   * Útil para guards
   */
  isTokenValid(): Observable<boolean> {
    return this.getUser().pipe(
      map(user => !!user) // true si hay usuario, false si no
    );
  }
}

