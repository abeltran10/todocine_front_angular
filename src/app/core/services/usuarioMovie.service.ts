import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError, Observable } from 'rxjs';

import { UsuarioMovie } from '../models/usuarioMovie.model';
import { MovieDetail } from '../models/movieDetail.model';
import { Paginator } from '../models/paginator.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioMovieService {

  private readonly baseUrl = '/api/usuarios';

  constructor(private http: HttpClient) {}

  updateUsuarioMovie(
    userId: number,
    movieId: number,
    usuarioMovie: UsuarioMovie
  ): Observable<MovieDetail> {

    return this.http.put<MovieDetail>(
        `${this.baseUrl}/${userId}/movies/${movieId}`,
        usuarioMovie
      ).pipe(
        catchError(err => {
          return throwError(() => err);
      }));
   
  }

  // Obtener películas del usuario
  getUserMovies(
    userId: number,
    vista: string,
    votada: string,
    order: string,
    pagina: number
  ): Observable<Paginator<MovieDetail>> {
    const url = `${this.baseUrl}/${userId}/movies?vista=${vista}&votada=${votada}&orderBy=${order}&page=${pagina}`;
    return this.http.get<Paginator<MovieDetail>>(url).pipe(
        catchError(err => {
        // Puedes loguear o transformar el error aquí
        return throwError(() => err);
      })
    );
    
  }

}
