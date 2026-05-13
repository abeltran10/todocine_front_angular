import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Lista } from '../models/lista.model';
import { Paginator } from '../models/paginator.model';

@Injectable({
  providedIn: 'root'
})
export class ListaService {
    private baseUrl = '/api/listas';

  constructor(private http: HttpClient) {}

  getListas(page: number) : Observable<Paginator<Lista>> {
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

}