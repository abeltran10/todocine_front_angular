import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Lista } from '../models/lista.model';
import { Paginator } from '../models/paginator.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioListaService {
    private baseUrl = '/api/usuarios';

  constructor(private http: HttpClient) {}

  getListas(userId: number, page: number): Observable<Paginator<Lista>> {
    return this.http.get<Paginator<Lista>>(
          `${this.baseUrl}/${userId}/listas?page=${page}`
          ).pipe( catchError(err => {
                  // Puedes loguear o transformar el error aquí
                  return throwError(() => err);
                }));
        
  }

}