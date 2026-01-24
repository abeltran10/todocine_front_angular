import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { UsuarioMovie } from '../models/usuarioMovie.model';
import { MovieDetail } from '../models/movieDetail.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioMovieService {

  private readonly baseUrl = '/app/usuarios';

  constructor(private http: HttpClient) {}

  async updateUsuarioMovie(
    userId: number,
    movieId: string,
    usuarioMovie: UsuarioMovie
  ): Promise<MovieDetail> {

    const response = await firstValueFrom(this.http.put<MovieDetail>(
        `${this.baseUrl}/${userId}/movies/${movieId}`,
        usuarioMovie
      )
    );

    return response;
  }
}
