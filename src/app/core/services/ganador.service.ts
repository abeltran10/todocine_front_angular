import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

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

 

  // Crear ganador
  async createGanador(ganador: GanadorPK): Promise<Ganador> {
    const response = await firstValueFrom(
      this.http.post<Ganador>(this.baseUrl, ganador)
    );
    return response;
  }
}
