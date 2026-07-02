import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, catchError, of, BehaviorSubject, timer } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

import { MovieService } from '../../core/services/movie.service';

import { Movie } from '../../core/models/movie.model';
import { Paginator } from '../../core/models/paginator.model';
import { User } from '../../core/models/user.model';

import { NavigationBarComponent } from '../../shared/layout/navigation-bar/navigation-bar.component';
import { NotificationComponent } from '../../shared/common/notification/notification.component';
import { HeaderComponent } from '../../shared/layout/header/header.component';
import { SearchFormComponent } from './search/search-form.component';
import { PaginatorComponent } from '../../shared/common/paginator/paginator.component';
import { MovieCardComponent } from './movie-card/movie-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NavigationBarComponent,
    NotificationComponent,
    HeaderComponent,
    SearchFormComponent,
    PaginatorComponent,
    MovieCardComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  title = 'TODO CINE';

  messageSuccessSubject = new BehaviorSubject<string>('');
  messageErrorSubject = new BehaviorSubject<string>('');
  successMessage$ = this.messageSuccessSubject.asObservable();;
  errorMessage$ = this.messageErrorSubject.asObservable();;

  emptyPaginator: Paginator<Movie> = {
      results: [], page: 1, total_pages: 1, total_results: 0
  }

  moviesSubject = new BehaviorSubject<Paginator<Movie> | null>(null);
  movies$ = this.moviesSubject.asObservable();

  paramSearch = '';

  usuario!: User;

  isLoading = false;

  constructor(
    private movieService: MovieService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Usuario logueado
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
      this.usuario = JSON.parse(loggedUser);
    }

    this.activatedRoute.paramMap
    .pipe(map(() => window.history.state))
    .subscribe(state => {
      // Verificamos si existe el mensaje
      if (state && state.successMessage) {
        this.setSuccessMessage(state.successMessage);

        // Limpiamos el estado del historial
        // El primer parámetro es el nuevo estado, el segundo es el título (opcional), 
        // y el tercero es la URL actual (null para mantenerla igual).
        const cleanState = { ...window.history.state };
        delete cleanState.successMessage;
        
        window.history.replaceState(cleanState, '', window.location.href);
      }
    });
  }

  search(text: string, pagina: number = 1) {
    this.isLoading = true; // Activar spinner

    this.movieService.getByName(text, pagina).subscribe({
        next: (paginator) => {
          this.moviesSubject.next(paginator);
          this.isLoading = false; // Desactivar en éxito
        },
        error: (error) => {
              this.setErrorMessage(error?.error?.message ?? 'Error cargando la búsqueda');
              this.isLoading = false; // Desactivar en error
        }
    }); 
    
    this.paramSearch = text;
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
