import { Component, Input, Output, EventEmitter, OnInit, signal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { BehaviorSubject, Observable, catchError, of } from 'rxjs';

import { Categoria } from '../../../../core/models/categoria.model';
import { Movie } from '../../../../core/models/movie.model';
import { Paginator } from '../../../../core/models/paginator.model';

import { MovieService } from '../../../../core/services/movie.service';
import { PremioService } from '../../../../core/services/premio.service';
import { Premio } from '../../../../core/models/premio.model';



@Component({
  selector: 'app-ganador-form',
  standalone: true,
  imports: [FormsModule,
            CommonModule
  ],
  templateUrl: './ganador-form.component.html',
})

export class GanadorFormComponent implements OnInit {

  categorias = signal<Categoria[] | null>(null);
 
  awards = signal<Premio[]>([]);
    
  enviar = output<{
    premioId: number | null;
    categoriaId: number | null;
    anyo: number | null;
    movieId: number | null;
  }>();

  error = output<string>();

  premioId: number | null = null;
  categoriaId: number | null = null;
  anyo: number | null = null;
  movieId: number | null = null;

  emptyPaginator: Paginator<Movie> = {
        results: [], page: 1, total_pages: 1, total_results: 0
    }
  
  movies = signal<Paginator<Movie>>(this.emptyPaginator);
    
  searchText: string = '';
  paramSearch: string = '';

  selectedMovieText = signal<string>('');

  constructor(private movieService: MovieService,
              private premioService:PremioService
  ) {}

  ngOnInit(): void {
     this.premioService.getPremios().subscribe({
        next: (premios) => this.awards.set(premios),
        error: (error) => {
              this.error.emit(error?.error?.message ?? 'Error cargando los premios');
              this.awards.set([]);
        }
     })    
  }

  loadCategorias(premioCod: number) {
    this.premioService
    .getCategorias(premioCod)
    .subscribe({
      next: (categorias) => this.categorias.set(categorias),
      error: (error) => {
          this.error.emit(error?.error?.message ?? 'Error cargando las categorias');
          this.categorias.set([])
      }
    });
  }

  searchMovies(text: string, pagina: number = 1) {
    this.movieService.getByName(text, pagina).subscribe({
        next: (paginator) => this.movies.set(paginator),
        error: (error) => {
              this.error.emit(error?.error?.message ?? 'Error cargando la busqueda');
              this.movies.set(this.emptyPaginator);
        }
    }); 
      this.paramSearch = text;
  }

  selectMovie(movie: Movie) {
    this.selectedMovieText.set(`${movie.title} (${movie.release_date.split('-')[0]})`);
    this.movieId = movie.id;
    this.movies.set(this.emptyPaginator);
    this.searchText = '';

  }

  handleAward(value: number) {
    this.premioId = value;
    this.loadCategorias(this.premioId);
  }

  
  handleSubmit() {
          this.enviar.emit({
            premioId: this.premioId,
            categoriaId: this.categoriaId,
            anyo: this.anyo,
            movieId: this.movieId
          });

          this.selectedMovieText.set('');
          this.premioId = null;
          this.categoriaId = null;
          this.anyo = null;
          this.movieId = null;
  }

}
