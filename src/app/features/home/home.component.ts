import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, catchError, of, BehaviorSubject, timer } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

import { MovieService } from '../../core/services/movie.service';
import { NotificationService } from '../../core/services/notification.service';

import { Movie } from '../../core/models/movie.model';
import { Paginator } from '../../core/models/paginator.model';
import { User } from '../../core/models/user.model';

import { SearchFormComponent } from './search/search-form.component';
import { PaginatorComponent } from '../../shared/common/paginator/paginator.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { HeaderService } from '../../core/services/header.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    SearchFormComponent,
    PaginatorComponent,
    MovieCardComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  title = 'TODO CINE';

  emptyPaginator: Paginator<Movie> = {
      results: [], page: 1, total_pages: 1, total_results: 0
  }

  moviesSubject = new BehaviorSubject<Paginator<Movie> | null>(null);
  movies$ = this.moviesSubject.asObservable();

  paramSearch = '';

  isLoading = false;

  constructor(
    private movieService: MovieService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private headerService: HeaderService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap
    .pipe(map(() => window.history.state))
    .subscribe(state => {
      // Verificamos si existe el mensaje
      if (state && state.successMessage) {
        this.notificationService.showSuccess(state.successMessage);

        // Limpiamos el estado del historial
        // El primer parámetro es el nuevo estado, el segundo es el título (opcional), 
        // y el tercero es la URL actual (null para mantenerla igual).
        const cleanState = { ...window.history.state };
        delete cleanState.successMessage;
        
        window.history.replaceState(cleanState, '', window.location.href);
      }
    });

    this.headerService.setTitle('TODO CINE');
  }

  search(text: string, pagina: number = 1) {
    this.isLoading = true;

    this.movieService.getByName(text, pagina).subscribe({
        next: (paginator) => {
          this.isLoading = false;
          this.moviesSubject.next(paginator);
        },
        error: (error) => {
              this.notificationService.showError(error?.error?.message ?? 'Error cargando la busqueda');
              this.isLoading = false;
              this.moviesSubject.next(this.emptyPaginator);
        }
    }); 
    
    this.paramSearch = text;
  }

}
