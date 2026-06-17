import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
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

  categorias$!: Observable<Categoria[] | null>;
  awards$!: Observable<Premio[]>;
  
  @Output() enviar = new EventEmitter<{
    premioId: number | null;
    categoriaId: number | null;
    anyo: number | null;
    movieId: number | null;
  }>();

  @Output() error = new EventEmitter<string>();

  premioId: number | null = null;
  categoriaId: number | null = null;
  anyo: number | null = null;
  movieId: number | null = null;

  emptyPaginator: Paginator<Movie> = {
        results: [], page: 1, total_pages: 1, total_results: 0
    }
  
    moviesSubject = new BehaviorSubject<Paginator<Movie>>(this.emptyPaginator);
    movies$ = this.moviesSubject.asObservable();
    

  searchText: string = '';
  paramSearch: string = '';
  selectedMovieText: string = '';

  constructor(private movieService: MovieService,
              private premioService:PremioService
  ) {}

  ngOnInit(): void {
     this.awards$ = this.premioService.getPremios().pipe(
          catchError(error => {
             this.error.emit(error?.error?.message ?? 'Error cargando los premios');
              return of([]);
          }) // emiti
     );
    
  }

  loadCategorias(premioCod: number) {
    this.categorias$ = this.premioService
    .getCategorias(premioCod)
    .pipe(
          catchError(error => {
             this.error.emit(error?.error?.message ?? 'Error cargando las categorias');
              return of([]);
          }) // emiti
      );
  }

  searchMovies(text: string, pagina: number = 1) {
    this.movieService.getByName(text, pagina).subscribe({
        next: (paginator) => this.moviesSubject.next(paginator),
        error: (error) => {
              this.error.emit(error?.error?.message ?? 'Error cargando la busqueda');
              this.moviesSubject.next(this.emptyPaginator);
        }
    }); 
      this.paramSearch = text;
  }

  selectMovie(movie: Movie) {
    this.selectedMovieText = `${movie.title} (${movie.release_date.split('-')[0]})`;
    this.movieId = movie.id;

    this.moviesSubject.next(this.emptyPaginator);

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

          this.selectedMovieText = '';
          this.premioId = null;
          this.categoriaId = null;
          this.anyo = null;
          this.movieId = null;
  }

}
