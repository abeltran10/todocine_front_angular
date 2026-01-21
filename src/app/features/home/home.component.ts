import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MovieService } from '../../core/services/movie.service';

import { Movie } from '../../core/models/movie.model';
import { Paginator } from '../../core/models/paginator.model';
import { User } from '../../core/models/user.model';

import { NavigationBarComponent } from '../../shared/layout/navigation-bar/navigation-bar.component';
import { NotificationComponent } from '../../shared/common/notification/notification.component';
import { HeaderComponent } from '../../shared/layout/header/header.component';
import { SearchFormComponent } from './search/search-form.component';
import { PaginatorComponent } from '../../shared/layout/paginator/paginator.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NavigationBarComponent,
    NotificationComponent,
    HeaderComponent,
    SearchFormComponent,
    PaginatorComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  title = 'TODO CINE';

  successMessage = '';
  errorMessage = '';

  movies: Paginator<Movie> | null = null;
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

  async search(text: string, pagina: number = 1) {
    try {
      this.movies = await this.movieService.getByName(text, pagina);
      this.paramSearch = text;
    } catch (error: any) {
      this.errorMessage = error?.error?.message ?? 'Error al buscar películas';
      setTimeout(() => (this.errorMessage = ''), 5000);
    }
  }

  /**
   * Prepara las filas de 3 películas
   */
  get movieRows(): (Movie | null)[][] {
    if (!this.movies) return [];

    const rows: (Movie | null)[][] = [];
    const results = this.movies.results;

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
