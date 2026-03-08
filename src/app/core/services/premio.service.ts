import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { Categoria } from '../models/categoria.model';


@Injectable({
  providedIn: 'root'
})
export class PremioService {

  private baseUrl = '/api/premios';

  constructor(private http: HttpClient) {}

  
  getCategorias(premioId: number): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(
      `${this.baseUrl}/${premioId}/categorias`
      ).pipe( catchError(err => {
              // Puedes loguear o transformar el error aquí
              return throwError(() => err);
            }));
  }

      
}
