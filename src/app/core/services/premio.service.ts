import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { Paginator } from '../models/paginator.model';
import { Ganador } from '../models/ganador.model';

@Injectable({
  providedIn: 'root'
})
export class PremioService {

  private readonly baseUrl = '/app/premios';

  constructor(private http: HttpClient) {}

  async getPremiosByCodigoAnyo(
    premioCod: number,
    anyo: number,
    pagina: number
  ): Promise<Paginator<Ganador>> {

    const url = `${this.baseUrl}/${premioCod}/anyos/${anyo}?pagina=${pagina}`;

    const response = await firstValueFrom(this.http.get<Paginator<Ganador>>(url));

    return response;
      
  }
}
