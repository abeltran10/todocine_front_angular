import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { catchError, throwError } from 'rxjs';

export interface LoginCredentials {
  username: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class LoginService {

  private baseUrl = '/api/login';

  constructor(private http: HttpClient) {}

  // Login
  async login(credentials: LoginCredentials) {
    // observe: 'response' permite obtener headers y body
    const response = await firstValueFrom(
      this.http.post<any>(
        this.baseUrl,
        credentials,
        { observe: 'response' }
      )
    );

    return response; // headers y body
  }

  // Logout
  logout() {
     return this.http.post<any>('/api/logout', null).pipe(
          catchError(err => {
            // Puedes loguear o transformar el error aquí
            return throwError(() => err);
          })
        )
  }
}
