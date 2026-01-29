import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Observable, catchError, throwError } from 'rxjs';

import {User} from '../models/user.model';
import { Paginator } from '../models/paginator.model';
import { MovieDetail } from '../models/movieDetail.model';

@Injectable({ providedIn: 'root' })
export class UserService {

  private baseUrl = '/api/usuarios';

  constructor(private http: HttpClient) {}

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`).pipe(
      catchError(err => {
        // Puedes loguear o transformar el error aquí
        return throwError(() => err);
      })
    );
  }

  // Obtener usuario por username
  async getByName(name: string): Promise<User[]> {
    const response = await firstValueFrom(
      this.http.get<User[]>(`${this.baseUrl}?username=${name}`)
    );
    return response;
  }

  // Crear usuario
  async createUser(credentials: Partial<User>): Promise<User> {
    const response = await firstValueFrom(
      this.http.post<User>(this.baseUrl, credentials)
    );
    return response;
  }

  // Actualizar usuario
  async updateUser(user: User): Promise<User> {
    const response = await firstValueFrom(
      this.http.put<User>(`${this.baseUrl}/${user.id}`, user)
    );
    return response;
  }

  // Obtener películas del usuario
  getUserMovies(
    userId: number,
    vista: string,
    votada: string,
    order: string,
    pagina: number
  ): Observable<Paginator<MovieDetail>> {
    const url = `${this.baseUrl}/${userId}/movies?vista=${vista}&votada=${votada}&orderBy=${order}&page=${pagina}`;
    return this.http.get<Paginator<MovieDetail>>(url).pipe(
        catchError(err => {
        // Puedes loguear o transformar el error aquí
        return throwError(() => err);
      })
    );
    
  }
}
