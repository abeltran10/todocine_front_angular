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
import { ListaTableComponent } from './table/lista-table.component';
import { ListaComentariosComponent } from './comentarios/lista-comentarios.component';

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
    ListaTableComponent,
    ListaComentariosComponent
  ],
  templateUrl: './lista-detail.component.html',
})
export class ListaDetailComponent implements OnInit {
  usuario!: User;
  

  emptyPaginator: Paginator<Movie> = {
      results: [], page: 1, total_pages: 1, total_results: 0
  }

  moviesSubject = new BehaviorSubject<Paginator<Movie>>(this.emptyPaginator);
  movies$ = this.moviesSubject.asObservable();
  
  paramSearch: string = '';
  searchText: string = '';
  listaId!: number;
  list!: Lista;
  
    
  private errorMessageSubject = new BehaviorSubject<string>('');
  errorMessage$ = this.errorMessageSubject.asObservable();

  messageSuccessSubject = new BehaviorSubject<string>('');  
  successMessage$ = this.messageSuccessSubject.asObservable();

  listaSubject = new BehaviorSubject<Lista | null>(null);
  lista$ = this.listaSubject.asObservable();

  moviesListSubject = new BehaviorSubject<Paginator<Movie> | null>(null);
  moviesList$ = this.moviesListSubject.asObservable();

  ordenar = {orderBy: '', direction: ''};

  constructor(
  private route: ActivatedRoute,
  private listaService: ListaService,
  private movieService: MovieService,
  private router: Router
) {}

  ngOnInit(): void {
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
      this.usuario = JSON.parse(loggedUser);
    }

    this.route.paramMap.subscribe(params => {
          this.listaId = Number(params.get('listaId'))
          if (!this.listaId) return;

          this.loadLista();
          this.loadMoviesList(1);
    }); 

  }

  loadLista() {
     this.listaService.getListaById(this.listaId).subscribe({
        next: (lista) => {
          this.listaSubject.next(lista);
          this.list = lista;
        },
        error: (error) => {
          this.setErrorMessage(error?.error?.message ?? 'Error al recuperar el detalle de la lista')
          this.listaSubject.next(null);
        }
    })
  }

  loadMoviesList(page: number) {
    this.listaService.getMoviesByLista(this.listaId, this.ordenar.orderBy, this.ordenar.direction , page).subscribe({
        next: (paginator) => this.moviesListSubject.next(paginator),
        error: (error) => {
              this.setErrorMessage(error?.error?.message ?? 'Error al recuperar las películas');
              this.moviesListSubject.next(this.emptyPaginator);
        } 
    })
  }

  handleMoviesList(query: {ordenar: any, page: number}) {
    this.ordenar = {...query.ordenar};
    this.loadMoviesList(query.page);
  }


   searchMovies(text: string, pagina: number = 1) {
      this.movieService.getByName(text, pagina).subscribe({
        next: (paginator) => this.moviesSubject.next(paginator),
        error: (error) => {
              this.setErrorMessage(error?.error?.message ?? 'Error cargando la busqueda');
              this.moviesSubject.next(this.emptyPaginator);
        }
      }); 
        this.paramSearch = text;
    }
  
    selectMovie(movie: Movie) {
      this.listaService.addMovieToList(this.listaId, movie.id).subscribe({
        next: () => {
            this.searchText = '';
            this.moviesSubject.next(this.emptyPaginator);
            this.handleMoviesList({ordenar: {orderBy: '', direction: ''}, page: 1});
        },
        error: (error) => this.setErrorMessage(error?.error?.message ?? 'Error al añadir la película a la lista')
      }); 
  
    }

    onEditar(isPublica: boolean): void {
        if (this.list && this.list.id) {
            this.listaService.editarLista(this.list.id, {... this.list, publica: isPublica}).subscribe({
              next: () => {
                  this.setSuccessMessage(isPublica ? 'Lista publicada con éxito' : 'Lista ocultada con exito');
                  this.loadLista();
              },
              error: (err) => this.setErrorMessage( err?.error?.message ?? 'No se pudo editar la lista')
            });     
        }       
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