import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  movies: Paginator<MovieDetail> | null = null;

  usuario!: User;

  vistaFiltro = '';
  votadaFiltro = '';
  order = '';

  constructor(
    private userService: UserService,
    private usuarioMovieService: UsuarioMovieService
  ) {}

  ngOnInit(): void {
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
      this.usuario = JSON.parse(loggedUser);
      this.loadUserFavs(1);
    }
  }

  async loadUserFavs(page: number = 1) {
    try {
      this.movies = await this.userService.getUserMovies(
        this.usuario.id,
        this.vistaFiltro,
        this.votadaFiltro,
        this.order,
        page
      );
    } catch (error: any) {
      this.errorMessage = error?.error?.message ?? 'Error al cargar favoritos';
      setTimeout(() => (this.errorMessage = ''), 5000);
    }
  }

  async updateVista(movie: MovieDetail, isVista: boolean, page: number) {
    try {
      const usuarioMovie = {
        usuarioId: this.usuario.id,
        movieId: movie.id,
        vista: isVista,
        favoritos: movie.favoritos,
        voto: null
      };

      await this.usuarioMovieService.updateUsuarioMovie(
        this.usuario.id,
        movie.id,
        usuarioMovie
      );

      await this.loadUserFavs(page);

      this.successMessage = isVista
        ? 'Película vista'
        : 'Película no vista';

      setTimeout(() => (this.successMessage = ''), 5000);
    } catch (error: any) {
      this.errorMessage = error?.error?.message ?? 'Error al actualizar';
      setTimeout(() => (this.errorMessage = ''), 5000);
    }
  }

  /** Grid de 3 */
  get movieRows(): (MovieDetail | null)[][] {
    if (!this.movies) return [];

    const rows: (MovieDetail | null)[][] = [];
    const results = this.movies.results;

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
