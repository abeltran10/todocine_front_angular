import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model'; // Asegura la ruta de tu modelo

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<User | null>;
  public user$: Observable<User>;

  constructor() {
    // Intentamos recuperar al usuario al iniciar el servicio
    const loggedUser = localStorage.getItem('loggedUser');
    const initialUser = loggedUser ? JSON.parse(loggedUser) : null;
    
    this.userSubject = new BehaviorSubject<User | null>(initialUser);
    this.user$ = this.userSubject.asObservable();
  }

  // Método para actualizar el usuario (usado tras el login)
  setUser(user: User): void {
    localStorage.setItem('loggedUser', JSON.stringify(user));
    this.userSubject.next(user);
  }

  setToken(token: string) {
    localStorage.setItem(
        'loggedUserToken',
         token 
    );
  }

  get token(): string | null {
    return localStorage.getItem('loggedUserToken');
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('loggedUserToken');
    localStorage.removeItem('loggedUser');

    this.userSubject.next(null);
  }

  // Getter valor actual de forma síncrona
  get currentUser(): User | null {
    return this.userSubject.value;
  }
}