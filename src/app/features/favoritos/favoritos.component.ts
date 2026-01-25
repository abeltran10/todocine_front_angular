import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, catchError, of } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

import { UserService } from '../../core/services/user.service';
import { UsuarioMovieService } from '../../core/services/usuarioMovie.service';

import { Paginator } from '../../core/models/paginator.model';
import { User } from '../../core/models/user.model';

import { NavigationBarComponent } from '../../shared/layout/navigation-bar/navigation-bar.component';
import { NotificationComponent } from '../../shared/common/notification/notification.component';
import { HeaderComponent } from '../../shared/layout/header/header.component';
import { PaginatorComponent } from '../../shared/layout/paginator/paginator.component';

import { FavoritosCardComponent } from './card/favoritos-card.component';
import { FavoritosFiltrosComponent } from './filtros/favoritos-filtros.component';
import { MovieDetail } from '../../core/models/movieDetail.model';


@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [
    CommonModule,
    NavigationBarComponent,
    NotificationComponent,
    HeaderComponent,
    FavoritosFiltrosComponent,
    FavoritosCardComponent,
    PaginatorComponent
  ],
  templateUrl: './favoritos.component.html'
})
export class FavoritosComponent implements OnInit {

  title = 'FAVORITOS';

  successMessage = '';
  errorMessage = '';

  movies$!: Observable<Paginator<MovieDetail>>;

  usuario!: User;

  vistaFiltro = '';
  votadaFiltro = '';
  order = '';

  constructor(
    private userService: UserService,
    private usuarioMovieService: UsuarioMovieService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
      this.usuario = JSON.parse(loggedUser);
      this.loadUserFavs(1);
    }
  }

  // Modificamos loadUserFavs para que devuelva algo que se pueda esperar
  loadUserFavs(page: number = 1): Promise<any> {
      const fetch$ = this.userService.getUserMovies(
        this.usuario.id,
        this.vistaFiltro,
        this.votadaFiltro,
        this.order,
        page
      ).pipe(
        catchError(error => {
          this.setErrorMessage(error?.error?.message ?? 'Error cargando los favoritos');
          return of({ results: [], page: 1, total_pages: 1, total_results: 0 });
        })
      );

      // Asignamos el observable a la variable que usa el HTML
      this.movies$ = fetch$;

      // RETORNAMOS una promesa que se resuelve cuando los datos llegan
      return lastValueFrom(fetch$);
  }
  async updateVista(movie: MovieDetail, isVista: boolean, page: number) {
      const usuarioMovie = {
        usuarioId: this.usuario.id,
        movieId: movie.id,
        vista: isVista,
        favoritos: movie.favoritos,
        voto: null
      };
      try {
          await this.usuarioMovieService.updateUsuarioMovie(
                  this.usuario.id,
                  movie.id,
                  usuarioMovie
                );

          await this.loadUserFavs(page)
          this.cdr.detectChanges();
          this.successMessage = isVista ? 'Película vista' : 'Película no vista';
          setTimeout(() => (this.successMessage = ''), 5000);
      } catch (error: any) {
          this.setErrorMessage(error?.error?.message ?? 'Error inesperado');
      }     
    
  }

  async onFiltersChange(filters: {
    usuarioId: number;
    vistaFiltro: string;
    votadaFiltro: string;
    order: string;
  }) {
    this.vistaFiltro = filters.vistaFiltro;
    this.votadaFiltro = filters.votadaFiltro;
    this.order = filters.order;

    // Siempre reiniciamos a la página 1 al cambiar filtros
    await this.loadUserFavs(1);
}


  /** Grid de 3 */
  buildRows(movies: Paginator<MovieDetail>): (MovieDetail | null)[][] {
    if (!movies) return [];

    const rows: (MovieDetail | null)[][] = [];
    const results = movies.results;

    for (let i = 0; i < results.length; i += 3) {
      const row: (MovieDetail | null)[] = results.slice(i, i + 3);

      while (row.length < 3) {
        row.push(null);
      }

      rows.push(row);
    }

    return rows;
  }

  setErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => (this.errorMessage = ''), 5000);
  }
}
