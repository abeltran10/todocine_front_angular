import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

import { UsuarioMovieService } from '../../core/services/usuarioMovie.service';

import { Paginator } from '../../core/models/paginator.model';
import { User } from '../../core/models/user.model';

import { PaginatorComponent } from '../../shared/common/paginator/paginator.component';

import { FavoritosCardComponent } from './card/favoritos-card.component';
import { FavoritosFiltrosComponent } from './filtros/favoritos-filtros.component';
import { MovieDetail } from '../../core/models/movieDetail.model';

import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { HeaderComponent } from '../../shared/layout/header/header.component';



@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [
    CommonModule,
    FavoritosFiltrosComponent,
    FavoritosCardComponent,
    PaginatorComponent,
    HeaderComponent
  ],
  templateUrl: './favoritos.component.html'
})
export class FavoritosComponent implements OnInit {
  emptyPaginator: Paginator<MovieDetail> = { results: [], page: 1, total_pages: 1, total_results: 0 }

  moviesSubject = new BehaviorSubject<Paginator<MovieDetail> | null>(null);
  movies$ =  this.moviesSubject.asObservable();

  usuario!: User | null;

  vistaFiltro = '';
  votadaFiltro = '';
  order = '';

  title: string = 'FAVORITOS';

  constructor(
    private usuarioMovieService: UsuarioMovieService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
     this.usuario = this.authService.currentUser;

     this.loadUserFavs(1);
  }

  
  loadUserFavs(page: number = 1) {
    if (!this.usuario) return;

    // Al iniciar la búsqueda/cambio de página, subimos el scroll
    window.scrollTo(0,0);

    this.usuarioMovieService.getUserMovies(
               this.usuario.id,
               this.vistaFiltro,
               this.votadaFiltro,
               this.order,
               page
             ).subscribe({
                next: (paginator) => this.moviesSubject.next(paginator),
                error: (error) => {
                    this.notificationService.showError(error?.error?.message ?? 'Error cargando favoritos');
                    this.moviesSubject.next(this.emptyPaginator);
                }
             })
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
}
