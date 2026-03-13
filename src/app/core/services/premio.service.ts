import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, shareReplay } from 'rxjs';

import { Categoria } from '../models/categoria.model';
import { Premio } from '../models/premio.model';


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

  getPremios(): Observable<Premio[]> {
    return this.http.get<Premio[]>(`${this.baseUrl}`).pipe(
      catchError(err => { return throwError(() => err) }),
      shareReplay(1) // Guarda el último valor y lo comparte con todos;
    );
  }

  getPremioById(premioId: number): Observable<Premio> {
    return this.http.get<Premio>(`${this.baseUrl}/${premioId}`).pipe(
      catchError(err => {return throwError(() => err)})      
    )
  }

      
}
