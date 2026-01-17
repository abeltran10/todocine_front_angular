import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Movie } from '../models/movie.model';
import { Paginator } from '../models/paginator.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private baseUrl = '/app/movies';

  constructor(private http: HttpClient) {}

  // Buscar por nombre (paginado)
  async getByName(name: string, page: number): Promise<Paginator<Movie>> {
    const response = await firstValueFrom(
      this.http.get<Paginator<Movie>>(
        `${this.baseUrl}?name=${name}&status=&region=&page=${page}`
      )
    );
    return response;
  }

  // Detalle de una película
  async getDetailMovieById(id: number): Promise<Movie> {
    const response = await firstValueFrom(
      this.http.get<Movie>(`${this.baseUrl}/${id}`)
    );
    return response;
  }

  // Películas en cartelera por región
  async getMoviesPlayingNowByRegion(region: string, page: number): Promise<Paginator<Movie>> {
    const response = await firstValueFrom(
      this.http.get<Paginator<Movie>>(
        `${this.baseUrl}?name=&status=now&region=${region}&page=${page}`
      )
    );
    return response;
  }
}
