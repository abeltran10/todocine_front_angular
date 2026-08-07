import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovieService } from '../../core/services/movie.service';
import { NotificationService } from '../../core/services/notification.service';

import { Movie } from '../../core/models/movie.model';
import { Paginator } from '../../core/models/paginator.model';


import { SearchFormComponent } from './search/search-form.component';
import { PaginatorComponent } from '../../shared/common/paginator/paginator.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { HeaderComponent } from '../../shared/layout/header/header.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    SearchFormComponent,
    PaginatorComponent,
    MovieCardComponent,
    HeaderComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent {

  emptyPaginator: Paginator<Movie> = {
      results: [], page: 1, total_pages: 1, total_results: 0
  };

  // Convertimos el subject en un Signal reactivo
  movies = signal<Paginator<Movie> | null>(null);
  
  paramSearch = '';
  isLoading = signal<boolean>(false);

  title = 'TODO CINE';

  constructor(
    private movieService: MovieService,
    private notificationService: NotificationService
  ) {}


  search(text: string, pagina: number = 1) {
    this.isLoading.set(true);
    window.scrollTo(0, 0);

    this.movieService.getByName(text, pagina).subscribe({
        next: (paginator) => {
          this.isLoading.set(false);
          this.movies.set(paginator); // Actualizamos el signal con los datos
        },
        error: (error) => {
          this.notificationService.showError(error?.error?.message ?? 'Error cargando la busqueda');
          this.isLoading.set(false);
          this.movies.set(this.emptyPaginator);
        }
    }); 
    
    this.paramSearch = text; 
  }
}