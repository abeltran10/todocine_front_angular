import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationBarComponent } from '../../../../shared/layout/navigation-bar/navigation-bar.component';
import { NotificationComponent } from '../../../../shared/common/notification/notification.component';
import { HeaderComponent } from '../../../../shared/layout/header/header.component';
import { CommonModule } from '@angular/common';

import { Observable, map, catchError, of, BehaviorSubject, timer } from 'rxjs';

import { Categoria } from '../../../../core/models/categoria.model';
import { User } from '../../../../core/models/user.model';
import { Movie } from '../../../../core/models/movie.model';
import { Paginator } from '../../../../core/models/paginator.model';

import { GanadorService } from '../../../../core/services/ganador.service';
import { CategoriaService } from '../../../../core/services/categoria.service';
import { MovieService } from '../../../../core/services/movie.service';

import { Awards, Award, AwardKey } from '../../../../core/enum/awards';
import { GanadorPK } from '../../../../core/models/ganadorPK.model';



@Component({
  selector: 'app-ganador-form',
  standalone: true,
  imports: [FormsModule,
            CommonModule,
            NavigationBarComponent,
            NotificationComponent,
            HeaderComponent,
  ],
  templateUrl: './ganador-form.component.html',
})

export class GanadorFormComponent implements OnInit{

  title = 'AÑADIR GANADOR';

  usuario!: User;

  messageErrorSubject = new BehaviorSubject<string>('');
  errorMessage$ = this.messageErrorSubject.asObservable();

  messageSuccessSubject = new BehaviorSubject<string>('');
  successMessage$ = this.messageSuccessSubject.asObservable();

  categorias$!: Observable<Categoria[]>;
  movies$!: Observable<Paginator<Movie> | null> ;

  paramSearch: string = '';
  selectedMovieText: string = '';
  selectedMovieId!: number;

  awards!: Award[];

  ganador: GanadorPK = {
    premioId: null,
    categoriaId: null,
    anyo: null,
    movieId: null
  };

  anyos: number[] = [2026];

  searchText: string = '';

  constructor(private ganadorService: GanadorService,
              private categoriaService: CategoriaService,
              private movieService: MovieService,

  ) {}

  ngOnInit(): void {
      // usuario logueado
      const loggedUser = localStorage.getItem('loggedUser');
      if (loggedUser) {
        this.usuario = JSON.parse(loggedUser);
      }

      this.loadCategorias();

      this.awards = Awards.getValues();

  }

  loadCategorias() {
    this.categorias$ = this.categoriaService
    .getCategorias()
    .pipe(
          catchError(error => {
             this.setErrorMessage(error?.error?.message ?? 'Error cargando las categorias');
              return of([]);
          }) // emiti
      );
  }

  searchMovies(text: string, pagina: number = 1) {
    this.movies$ = this.movieService.getByName(text, pagina).pipe(
        catchError(error => {
              this.setErrorMessage(error?.error?.message ?? 'Error cargando la busqueda');
              return of(null); // emitimos un valor neutro para no romper el stream
            })
      );
      this.paramSearch = text;
  }

  selectMovie(movie: Movie) {
    this.selectedMovieText = `${movie.title} (${movie.release_date.split('-')[0]})`;
    this.ganador.movieId = movie.id;

    this.movies$ = of(null);

    this.searchText = '';

  }

  
  async onSubmit() {
    // Aquí ya tienes todos los datos en this.ganador
    if (this.ganador.premioId && this.ganador.anyo && this.ganador.categoriaId && this.ganador.movieId) {
       try {
          await this.ganadorService.createGanador(this.ganador);
          this.setSuccessMessage("Ganador creado correctamente");
          
          this.ganador = {
            premioId: null,
            categoriaId: null,
            anyo: null,
            movieId: null
          };

          this.selectedMovieText = '';
       } catch (error: any) {
          this.setErrorMessage(error?.error?.message ?? 'Error guardando el ganador');
       }
    } else {
      alert('Por favor, rellena todos los campos');
    }
  }



  setSuccessMessage(message: string) {
    this.messageSuccessSubject.next(message);

    // Usamos un timer de RxJS que es más compatible con Angular
    timer(5000).subscribe(() => this.messageSuccessSubject.next(''));
  }

  setErrorMessage(message: string) {
      this.messageErrorSubject.next(message);
  
      // Usamos un timer de RxJS que es más compatible con Angular
      timer(5000).subscribe(() => this.messageErrorSubject.next(''));
  }
}
