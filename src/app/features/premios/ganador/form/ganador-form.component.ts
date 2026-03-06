import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Observable, catchError, of } from 'rxjs';

import { Categoria } from '../../../../core/models/categoria.model';
import { Movie } from '../../../../core/models/movie.model';
import { Paginator } from '../../../../core/models/paginator.model';

import { MovieService } from '../../../../core/services/movie.service';

import { Award } from '../../../../core/enum/awards';



@Component({
  selector: 'app-ganador-form',
  standalone: true,
  imports: [FormsModule,
            CommonModule
  ],
  templateUrl: './ganador-form.component.html',
})

export class GanadorFormComponent {

  @Input() awards!: Award[];
  @Input() categorias!: Categoria[] | null;

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

  constructor(private movieService: MovieService) {}

 
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
    this.anyos = this.awards[value - 1].anyos;
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
