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

 // 1. Creamos la variable que guardará el "tubo" con los datos
  private premiosCache$?: Observable<Premio[]>;

  getPremios(): Observable<Premio[]> {
    // 2. Si la variable está vacía, configuramos la petición por primera (y única) vez
    if (!this.premiosCache$) {
      this.premiosCache$ = this.http.get<Premio[]>(`${this.baseUrl}`).pipe(
        shareReplay(1), // Hace que el último valor se quede "grabado" en el tubo
        catchError(err => {
          // 3. Importante: si hay error, limpiamos la caché para permitir reintentar
          this.premiosCache$ = undefined;
          return throwError(() => err);
        })
      );
    }

    // 4. Devolvemos siempre la misma instancia (la que tiene los datos o está en camino)
    return this.premiosCache$;
  }

  getPremioById(premioId: number): Observable<Premio> {
    return this.http.get<Premio>(`${this.baseUrl}/${premioId}`).pipe(
      catchError(err => {return throwError(() => err)})      
    )
  }

      
}
