import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ListaService } from '../../../core/services/lista.service';
import { MovieService } from '../../../core/services/movie.service';
import { Observable, BehaviorSubject, combineLatest, of, timer, shareReplay } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { User } from '../../../core/models/user.model';
import { Lista } from '../../../core/models/lista.model';
import { Movie } from '../../../core/models/movie.model';
import { Paginator } from '../../../core/models/paginator.model';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from '../../../shared/layout/header/header.component';
import { NavigationBarComponent } from '../../../shared/layout/navigation-bar/navigation-bar.component';
import { NotificationComponent } from '../../../shared/common/notification/notification.component';
import { PaginatorComponent } from '../../../shared/common/paginator/paginator.component';

import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-detail',
  standalone: true,
  imports: [CommonModule, 
    RouterModule, 
    FormsModule, 
    HeaderComponent, 
    NavigationBarComponent, 
    NotificationComponent,
    PaginatorComponent
  ],
  templateUrl: './lista-detail.component.html',
})
export class ListaDetailComponent implements OnInit {
  usuario!: User;
  lista$!: Observable<Lista | null>;
  movies$!: Observable<Paginator<Movie> | null>;
  paramSearch: string = '';
  searchText: string = '';
  listaId!: number;
  list!: Lista;
  moviesList$!: Observable<Paginator<Movie> | null>;
    
  private errorMessageSubject = new BehaviorSubject<string>('');
  errorMessage$ = this.errorMessageSubject.asObservable();

  messageSuccessSubject = new BehaviorSubject<string>('');  
  successMessage$ = this.messageSuccessSubject.asObservable();

  private refreshLista$ = new BehaviorSubject<void>(undefined);
  private refreshMoviesList$ = new BehaviorSubject<number>(1);

  constructor(
  private route: ActivatedRoute,
  private listaService: ListaService,
  private movieService: MovieService,
  private router: Router
) {
  // --- FLUJO 1: Obtener los datos generales de la lista ---
  this.lista$ = combineLatest([
    this.route.paramMap,
    this.refreshLista$
  ]).pipe(
    switchMap(([params, _]) => {
      this.listaId = Number(params.get('listaId'));
      if (!this.listaId) return of(null);

      return this.listaService.getListaById(this.listaId).pipe(
        tap(res => { if (res) this.list = res; }),
        catchError(error => {
          this.setErrorMessage(error?.error?.message ?? 'Error al recuperar el detalle de la lista');
          return of(null);
        })
      );
    }),
    shareReplay(1) 
  );

  // --- FLUJO 2: Obtener las películas paginadas de la lista ---
  this.moviesList$ = combineLatest([
    this.route.paramMap,
    this.refreshMoviesList$
  ]).pipe(
    switchMap(([params, paginaActual]) => {
      this.listaId = Number(params.get('listaId'));
      if (!this.listaId) return of(null);

      return this.listaService.getMoviesByLista(this.listaId, paginaActual).pipe(
        catchError(error => {
          this.setErrorMessage(error?.error?.message ?? 'Error al recuperar las películas');
          return of({ results: [], page: 1, total_pages: 1, total_results: 0 });
        })
      );
    }),
    shareReplay(1)
  );
}

  ngOnInit(): void {
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
      this.usuario = JSON.parse(loggedUser);
    }

    this.loadLista();
    this.loadMoviesList(1);

  }

  loadLista() {
    this.refreshLista$.next();
  }

  loadMoviesList(page: number) {
    this.refreshMoviesList$.next(page);
  }

  eliminarPelicula(movieId: number) {
    this.listaService.deleteMovieFromList(movieId, this.listaId).pipe(
        catchError(error => {
                  this.setErrorMessage(error?.error?.message ?? 'Error al eliminar la película de la lista');
                  return of(null);
                })
    ).subscribe(() => {
       this.loadMoviesList(1);
    });
  }

   searchMovies(text: string, pagina: number = 1) {
      this.movies$ = this.movieService.getByName(text, pagina).pipe(
          catchError(error => {
                this.setErrorMessage(error?.error?.message ?? 'Error al cargar las películas');
                return of(null); // emitimos un valor neutro para no romper el stream
              })
        );
        this.paramSearch = text;
    }
  
    selectMovie(movie: Movie) {
      this.listaService.addMovieToList(this.listaId, movie.id).pipe(
        catchError(error => {
                this.setErrorMessage(error?.error?.message ?? 'Error al añadir la película a la lista');
                return of(null); // emitimos un valor neutro para no romper el stream
              })
        ).subscribe(() => {
          this.searchText = '';
          this.movies$ = of(null);
          this.loadMoviesList(1);
        });
  
    }

    onEditar(isPublica: boolean): void {
        if (this.list && this.list.id) {
            this.listaService.editarLista(this.list.id, {id: this.list.id, nombre: this.list.nombre, descripcion: this.list.descripcion, usuarioId: this.usuario.id, publica: isPublica}).subscribe({
              next: () => {
                  this.setSuccessMessage(isPublica ? 'Lista publicada con éxito' : 'Lista ocultada con exito');
                  this.loadLista();
              },
              error: (err) => this.setErrorMessage( err?.error?.message ?? 'No se pudo editar la lista')
            });     
        }       
    }

    handleLoadMovieDetail(movieId: number): void {
      this.router.navigate(['/app/moviedetail', movieId]);
    }

  setSuccessMessage(message: string) {
    this.messageSuccessSubject.next(message);

    // Usamos un timer de RxJS que es más compatible con Angular
    timer(5000).subscribe(() => this.messageSuccessSubject.next(''));
  }

  setErrorMessage(msg: string) {
      this.errorMessageSubject.next(msg);
      // Usamos un timer de RxJS que es más compatible con Angular
      timer(5000).subscribe(() => this.errorMessageSubject.next(''));
  }
}