import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { Movie } from '../models/movie.model';
import { MovieDetail } from '../models/movieDetail.model';
import { Paginator } from '../models/paginator.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private baseUrl = '/app/movies';

  constructor(private http: HttpClient) {}

  // Buscar por nombre (paginado)
  getByName(name: string, page: number): Observable<Paginator<Movie>> {
    return this.http.get<Paginator<Movie>>(
      `${this.baseUrl}?name=${name}&status=&region=&page=${page}`
      ).pipe( catchError(err => {
              // Puedes loguear o transformar el error aquí
              return throwError(() => err);
            }));
    
    
  }

  // Detalle de una película
  getDetailMovieById(id: string): Observable<MovieDetail> {
     return this.http.get<MovieDetail>(`${this.baseUrl}/${id}`)
        .pipe(catchError(err => {
          return throwError(() => err)
        }));       
        
  }

  // Películas en cartelera por región
  getMoviesPlayingNowByRegion(region: string, page: number): Observable<Paginator<Movie>> {
    return this.http.get<Paginator<Movie>>(
        `${this.baseUrl}?name=&status=now&region=${region}&page=${page}`
      ).pipe(catchError(err => {
              // Puedes loguear o transformar el error aquí
              return throwError(() => err);
            })
          );
    
  }
}
