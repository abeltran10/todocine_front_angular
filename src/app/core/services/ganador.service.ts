import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { firstValueFrom } from 'rxjs';

import { Paginator } from '../models/paginator.model';
import { Ganador } from '../models/ganador.model';

interface GanadorPK {
    premioId: number | null;
    categoriaId: number | null;
    anyo: number | null;
    movieId: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class GanadorService {

  private readonly baseUrl = '/api/ganadores';

  constructor(private http: HttpClient) {}

  getGanadoresByPremioIdAnyo(
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

    // Crear ganador
    async createGanador(ganador: GanadorPK): Promise<Ganador> {
      const response = await firstValueFrom(
        this.http.post<Ganador>(this.baseUrl, ganador)
      );
      return response;
    }
}
