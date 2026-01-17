import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MovieService } from '../../core/services/movie.service';

import { Movie } from '../../core/models/movie.model';
import { Paginator } from '../../core/models/paginator.model';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  title = 'TODO CINE';

  successMessage = '';
  errorMessage = '';

  movies: Paginator<Movie> = null;
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
  get movieRows(): Movie[][] {
    if (!this.movies) return [];

    const rows: Movie[][] = [];
    const results = this.movies.results;

    for (let i = 0; i < results.length; i += 3) {
      rows.push(results.slice(i, i + 3));
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
