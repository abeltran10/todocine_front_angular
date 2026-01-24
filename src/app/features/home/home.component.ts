import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, catchError, of } from 'rxjs';

import { MovieService } from '../../core/services/movie.service';

import { Movie } from '../../core/models/movie.model';
import { Paginator } from '../../core/models/paginator.model';
import { User } from '../../core/models/user.model';

import { NavigationBarComponent } from '../../shared/layout/navigation-bar/navigation-bar.component';
import { NotificationComponent } from '../../shared/common/notification/notification.component';
import { HeaderComponent } from '../../shared/layout/header/header.component';
import { SearchFormComponent } from './search/search-form.component';
import { PaginatorComponent } from '../../shared/layout/paginator/paginator.component';
import { MovieCardComponent } from '../movie-detail/card/movie-card.component';

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

  successMessage = '';
  errorMessage = '';

  movies$!: Observable<Paginator<Movie>>;
  paramSearch = '';

  usuario!: User;

  constructor(
    private movieService: MovieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Usuario logueado
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
      this.usuario = JSON.parse(loggedUser);
    }

    // Equivalente a useLocation().state
    const navigation = this.router.currentNavigation();
    this.successMessage =
      navigation?.extras.state?.['successMessage'] ?? '';

    if (this.successMessage) {
      setTimeout(() => (this.successMessage = ''), 5000);
    }
  }

  search(text: string, pagina: number = 1) {
    this.movies$ = this.movieService.getByName(text, pagina).pipe(
        catchError(error => {
              this.setErrorMessage(error?.error?.message ?? 'Error cargando la busqueda');
              return of({
                results: [],
                page: 1,
                total_pages: 1,
                total_results: 0
              }); // emitimos un valor neutro para no romper el stream
            })
      );
    this.paramSearch = text;
  }

  /**
   * Prepara las filas de 3 películas
   */
  buildRows(movies: Paginator<Movie>): (Movie | null)[][] {
    if (!movies) return [];

    const rows: (Movie | null)[][] = [];
    const results = movies.results;

    for (let i = 0; i < results.length; i += 3) {
      const row: (Movie | null)[] = results.slice(i, i + 3);

      // rellenar hasta 3
      while (row.length < 3) {
        row.push(null);
      }

      rows.push(row);
    }

    return rows;
  }



  setErrorMessage(message: string) {
    this.errorMessage = message;

    setTimeout(() => {
    this.errorMessage = '';
  }, 5000);
  }

}
