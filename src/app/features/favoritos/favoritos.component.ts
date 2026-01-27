import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, catchError, of, ReplaySubject, switchMap, shareReplay, BehaviorSubject, timer } from 'rxjs';

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

  messageSuccessSubject = new BehaviorSubject<string>('');
  messageErrorSubject = new BehaviorSubject<string>('');
  successMessage$ = this.messageSuccessSubject.asObservable();
  errorMessage$ = this.messageErrorSubject.asObservable();

  movies$: Observable<Paginator<MovieDetail>>;

  usuario!: User;

  vistaFiltro = '';
  votadaFiltro = '';
  order = '';
  
  private refreshUserFavs = new ReplaySubject<number>(1);

  constructor(
    private userService: UserService,
    private usuarioMovieService: UsuarioMovieService,
  ) {
    
    this.movies$ = this.refreshUserFavs.pipe(
            switchMap(page => this.userService.getUserMovies(
              this.usuario.id,
              this.vistaFiltro,
              this.votadaFiltro,
              this.order,
              page
            )),
            shareReplay(1),
            catchError(error => {
              this.setErrorMessage(error?.error?.message ?? 'Error cargando favoritos');
              return of({ results: [], page: 1, total_pages: 1, total_results: 0 });
            })
    );

  }

  ngOnInit(): void {
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
      this.usuario = JSON.parse(loggedUser);

      this.loadUserFavs(1);
    }

    
  }

  
  loadUserFavs(page: number = 1) {
    this.refreshUserFavs.next(page);
  }
  
  updateVista(movie: MovieDetail, isVista: boolean, page: number) {
      const usuarioMovie = {
        usuarioId: this.usuario.id,
        movieId: movie.id,
        vista: isVista,
        favoritos: movie.favoritos,
        voto: null
      };
      
      this.usuarioMovieService.updateUsuarioMovie(
                  this.usuario.id,
                  movie.id,
                  usuarioMovie
                ).pipe(
                    catchError(error =>  {
                      this.setErrorMessage(error?.error?.message ?? 'Error actualizando el estado de los favoritos');
                      return of(null);
                  })
                ).subscribe({
                  next: () => {
                      this.loadUserFavs(page);
                    }
                  }
                );

      this.setSuccessMessage(isVista ? 'Película vista' : 'Película no vista');
            
    
  }

  onFiltersChange(filters: {
    usuarioId: number;
    vistaFiltro: string;
    votadaFiltro: string;
    order: string;
  }) {
    this.vistaFiltro = filters.vistaFiltro;
    this.votadaFiltro = filters.votadaFiltro;
    this.order = filters.order;

    this.loadUserFavs(1);
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
    this.messageErrorSubject.next(message);

    // Usamos un timer de RxJS que es más compatible con Angular
    timer(5000).subscribe(() => this.messageErrorSubject.next(''));
  }

  setSuccessMessage(message: string) {
    this.messageSuccessSubject.next(message);

    // Usamos un timer de RxJS que es más compatible con Angular
    timer(5000).subscribe(() => this.messageSuccessSubject.next(''));
  }
}
