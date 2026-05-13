import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Lista } from '../models/lista.model';
import { Paginator } from '../models/paginator.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioListaService {
    private baseUrl = '/api/usuarios';

  constructor(private http: HttpClient) {}

  getListas(userId: number, page: number): Observable<Paginator<Lista>> {
    return this.http.get<Paginator<Lista>>(
          `${this.baseUrl}/${userId}/listas?page=${page}`
          ).pipe( catchError(err => {
                  // Puedes loguear o transformar el error aquí
                  return throwError(() => err);
                }));
        
  }

  crearLista(lista: Lista, userId: number): Observable<Lista> {
    return this.http.post<Lista>(
      `${this.baseUrl}/${userId}/listas`, 
      lista
    ).pipe(
        catchError(err => {
          return throwError(() => err);
      }));
  }
  

  deleteMovieFromList(movieId: number, listaId: number, userId: number): Observable<void> {
    return this.http.delete<void>(
          `${this.baseUrl}/${userId}/listas/${listaId}/movies/${movieId}`
          ).pipe(catchError(err => {
                  // Puedes loguear o transformar el error aquí
                  return throwError(() => err);
                }));
  }

  addMovieToList(userId: number, listaId: number, movieId: number): Observable<Lista> {
    return this.http.post<Lista>(
          `${this.baseUrl}/${userId}/listas/${listaId}/movies/${movieId}`, null
          ).pipe(catchError(err => {
                  // Puedes loguear o transformar el error aquí
                  return throwError(() => err);
                }));
  }

  borrarLista(userId: number, listaId: number): Observable<void> {
    return this.http.delete<void>(
          `${this.baseUrl}/${userId}/listas/${listaId}`
          ).pipe(catchError(err => {
                  // Puedes loguear o transformar el error aquí
                  return throwError(() => err);
                }));
  }

  editarLista(userId: number, listaId: number, lista: Lista): Observable<Lista> {
    return this.http.put<Lista>(
      `${this.baseUrl}/${userId}/listas/${listaId}`, lista
    ).pipe(catchError(err => {
                  // Puedes loguear o transformar el error aquí
                  return throwError(() => err);
                }));
  }
}