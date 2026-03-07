import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Observable, catchError, of } from 'rxjs';

import { Categoria } from '../../../../core/models/categoria.model';
import { Movie } from '../../../../core/models/movie.model';
import { Paginator } from '../../../../core/models/paginator.model';
import { Awards, Award, AwardKey } from '../../../../core/enum/awards';

import { MovieService } from '../../../../core/services/movie.service';
import { PremioService } from '../../../../core/services/premio.service';



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
  awards!: Award[];
  
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

  movies$!: Observable<Paginator<Movie> | null>;

  anyos!: number[];

  searchText: string = '';
  paramSearch: string = '';
  selectedMovieText: string = '';

  constructor(private movieService: MovieService,
              private premioService:PremioService
  ) {}

  ngOnInit(): void {
     this.awards = Awards.getValues();
    
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
    this.movies$ = this.movieService.getByName(text, pagina).pipe(
        catchError(error => {
              this.error.emit(error?.error?.message ?? 'Error al cargar las películas');
              return of(null); // emitimos un valor neutro para no romper el stream
            })
      );
      this.paramSearch = text;
  }

  selectMovie(movie: Movie) {
    this.selectedMovieText = `${movie.title} (${movie.release_date.split('-')[0]})`;
    this.movieId = movie.id;

    this.movies$ = of(null);

    this.searchText = '';

  }

  handleAward(value: number) {
    this.premioId = value;
    this.anyos = Awards.getAward(this.premioId as AwardKey).anyos;
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
