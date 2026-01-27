import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError, Observable } from 'rxjs';

import { UsuarioMovie } from '../models/usuarioMovie.model';
import { MovieDetail } from '../models/movieDetail.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioMovieService {

  private readonly baseUrl = '/app/usuarios';

  constructor(private http: HttpClient) {}

  updateUsuarioMovie(
    userId: number,
    movieId: string,
    usuarioMovie: UsuarioMovie
  ): Observable<MovieDetail> {

    return this.http.put<MovieDetail>(
        `${this.baseUrl}/${userId}/movies/${movieId}`,
        usuarioMovie
      ).pipe(
        catchError(err => {
          return throwError(() => err);
      }))
   
  }
}
