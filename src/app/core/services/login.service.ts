import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

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
  async logout() {
    await firstValueFrom(
      this.http.post('/app/logout', null) // token se añade automáticamente desde el interceptor
    );
  }
}
