import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, catchError, of, ReplaySubject, switchMap, shareReplay, BehaviorSubject, timer } from 'rxjs';

import { UsuarioMovieService } from '../../core/services/usuarioMovie.service';

import { Paginator } from '../../core/models/paginator.model';
import { User } from '../../core/models/user.model';

import { NavigationBarComponent } from '../../shared/layout/navigation-bar/navigation-bar.component';
import { NotificationComponent } from '../../shared/common/notification/notification.component';
import { HeaderComponent } from '../../shared/layout/header/header.component';
import { PaginatorComponent } from '../../shared/common/paginator/paginator.component';

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
  successMessage$ = this.messageSuccessSubject.asObservable();
  
  messageErrorSubject = new BehaviorSubject<string>('');
  errorMessage$ = this.messageErrorSubject.asObservable();

  movies$!: Observable<Paginator<MovieDetail>>;

  usuario!: User;

  vistaFiltro = '';
  votadaFiltro = '';
  order = '';
  
  private refreshUserFavs = new ReplaySubject<number>(1);

  constructor(
    private usuarioMovieService: UsuarioMovieService,
  ) {
    
    this.movies$ = this.refreshUserFavs.pipe(
             switchMap(page => this.usuarioMovieService.getUserMovies(
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
