import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Lista } from '../models/lista.model';
import { Paginator } from '../models/paginator.model';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class ListaService {
    private baseUrl = '/api/listas';

  constructor(private http: HttpClient) {}

  getListasPublicas(page: number) : Observable<Paginator<Lista>> {
    return this.http.get<Paginator<Lista>>(
          `${this.baseUrl}?page=${page}`
          ).pipe( catchError(err => {
                  // Puedes loguear o transformar el error aquí
                  return throwError(() => err);
                }));
        
  }

  getListaById(listaId: number): Observable<Lista> {
      return this.http.get<Lista>(
          `${this.baseUrl}/${listaId}`
          ).pipe( catchError(err => {
                  // Puedes loguear o transformar el error aquí
                  return throwError(() => err);
                }));
  }

  crearLista(lista: Lista): Observable<Lista> {
    return this.http.post<Lista>(
      `${this.baseUrl}`, 
      lista
    ).pipe(
        catchError(err => {
          return throwError(() => err);
      }));
  }

  editarLista(listaId: number, lista: Lista): Observable<Lista> {
    return this.http.put<Lista>(
      `${this.baseUrl}/${listaId}`, lista
    ).pipe(catchError(err => {
                  // Puedes loguear o transformar el error aquí
                  return throwError(() => err);
                }));
  }

  borrarLista(listaId: number): Observable<void> {
    return this.http.delete<void>(
          `${this.baseUrl}/${listaId}`
          ).pipe(catchError(err => {
                  // Puedes loguear o transformar el error aquí
                  return throwError(() => err);
                }));
  }
  
  getMoviesByLista(listaId: number, page: number): Observable<Paginator<Movie>> {
      return this.http.get<Paginator<Movie>>(
          `${this.baseUrl}/${listaId}/movies?page=${page}`
          ).pipe( catchError(err => {
                  // Puedes loguear o transformar el error aquí
                  return throwError(() => err);
                }));
        
    }

  deleteMovieFromList(movieId: number, listaId: number): Observable<void> {
    return this.http.delete<void>(
          `${this.baseUrl}/${listaId}/movies/${movieId}`
          ).pipe(catchError(err => {
                  // Puedes loguear o transformar el error aquí
                  return throwError(() => err);
                }));
  }

  addMovieToList(listaId: number, movieId: number): Observable<Movie> {
    return this.http.post<Movie>(
          `${this.baseUrl}/${listaId}/movies/${movieId}`, null
          ).pipe(catchError(err => {
                  // Puedes loguear o transformar el error aquí
                  return throwError(() => err);
                }));
  }

  
}