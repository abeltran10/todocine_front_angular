import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model'; // Asegura la ruta de tu modelo

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private userSignal = signal<User | null>(this.getInitialUser());
  public user = this.userSignal.asReadonly();

  private getInitialUser(): User | null {
    const loggedUser = localStorage.getItem('loggedUser');
    return loggedUser ? JSON.parse(loggedUser) : null;
  }

  setUser(user: User): void {
    localStorage.setItem('loggedUser', JSON.stringify(user));
    this.userSignal.set(user); 
  }

  setToken(token: string) {
    localStorage.setItem('loggedUserToken', token);
  }

  get token(): string | null {
    return localStorage.getItem('loggedUserToken');
  }

  logout(): void {
    localStorage.removeItem('loggedUserToken');
    localStorage.removeItem('loggedUser');
    this.userSignal.set(null); 
  }

  get currentUser(): User | null {
    return this.userSignal(); 
  }
}