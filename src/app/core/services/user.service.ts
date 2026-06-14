import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Observable, catchError, throwError } from 'rxjs';

import {User} from '../models/user.model';


interface Credentials {
    username: string;
    password: string;
  
}

@Injectable({ providedIn: 'root' })
export class UserService {

  private baseUrl = '/api/usuarios';

  constructor(private http: HttpClient) {}


  // Crear usuario
  createUser(credentials: Credentials): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}`, credentials).pipe(
      catchError(err => {
        // Puedes loguear o transformar el error aquí
        return throwError(() => err);
      })
    )
  }

  // Actualizar usuario
  updateUser(user: User):Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${user.id}`, user).pipe(
      catchError(err => {
        // Puedes loguear o transformar el error aquí
        return throwError(() => err);
      })
    )
  }

  
}
