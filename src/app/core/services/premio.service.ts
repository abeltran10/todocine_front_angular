import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { Paginator } from '../models/paginator.model';
import { Ganador } from '../models/ganador.model';

@Injectable({
  providedIn: 'root'
})
export class PremioService {

  private readonly baseUrl = '/api/premios';

  constructor(private http: HttpClient) {}

  getPremiosByCodigoAnyo(
    premioCod: number,
    anyo: number,
    pagina: number
  ): Observable<Paginator<Ganador>> {

    const url = `${this.baseUrl}/${premioCod}/anyos/${anyo}?pagina=${pagina}`;

    return this.http.get<Paginator<Ganador>>(url).pipe(
      catchError(err => {
        // Puedes loguear o transformar el error aquí
        return throwError(() => err);
      })
    );
  }
}
