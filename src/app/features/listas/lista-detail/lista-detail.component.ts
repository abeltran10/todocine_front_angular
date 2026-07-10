import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ListaService } from '../../../core/services/lista.service';
import { MovieService } from '../../../core/services/movie.service';
import { BehaviorSubject, timer } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { Lista } from '../../../core/models/lista.model';
import { Movie } from '../../../core/models/movie.model';
import { Paginator } from '../../../core/models/paginator.model';
import { FormsModule } from '@angular/forms';

import { ListaTableComponent } from './table/lista-table.component';
import { ListaComentariosComponent } from './comentarios/lista-comentarios.component';

import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { HeaderService } from '../../../core/services/header.service';

@Component({
  selector: 'app-lista-detail',
  standalone: true,
  imports: [CommonModule, 
    RouterModule, 
    FormsModule, 
    ListaTableComponent,
    ListaComentariosComponent
  ],
  templateUrl: './lista-detail.component.html',
})
export class ListaDetailComponent implements OnInit {
  usuario!: User | null;
  

  emptyPaginator: Paginator<Movie> = {
      results: [], page: 1, total_pages: 1, total_results: 0
  }

  moviesSubject = new BehaviorSubject<Paginator<Movie>>(this.emptyPaginator);
  movies$ = this.moviesSubject.asObservable();
  
  paramSearch: string = '';
  searchText: string = '';
  listaId!: number;
  list!: Lista;

  listaSubject = new BehaviorSubject<Lista | null>(null);
  lista$ = this.listaSubject.asObservable();

  moviesListSubject = new BehaviorSubject<Paginator<Movie> | null>(null);
  moviesList$ = this.moviesListSubject.asObservable();

  ordenar = {orderBy: '', direction: ''};

  constructor(
  private route: ActivatedRoute,
  private listaService: ListaService,
  private movieService: MovieService,
  private authService: AuthService,
  private notificationService: NotificationService,
  private headerService: HeaderService
) {}

  ngOnInit(): void {
    
    this.usuario = this.authService.currentUser;

    this.route.paramMap.subscribe(params => {
          this.listaId = Number(params.get('listaId'))
          if (!this.listaId) return;

          this.loadLista();
          this.loadMoviesList(1);

          this.headerService.setTitle(this.list?.nombre.toUpperCase());

    }); 

  }

  loadLista() {
     this.listaService.getListaById(this.listaId).subscribe({
        next: (lista) => {
          this.listaSubject.next(lista);
          this.list = lista;
        },
        error: (error) => {
          this.notificationService.showError(error?.error?.message ?? 'Error al recuperar el detalle de la lista')
          this.listaSubject.next(null);
        }
    })
  }

  loadMoviesList(page: number) {
    this.listaService.getMoviesByLista(this.listaId, this.ordenar.orderBy, this.ordenar.direction , page).subscribe({
        next: (paginator) => this.moviesListSubject.next(paginator),
        error: (error) => {
              this.notificationService.showError(error?.error?.message ?? 'Error al recuperar las películas');
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
              this.notificationService.showError(error?.error?.message ?? 'Error cargando la busqueda');
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
        error: (error) => this.notificationService.showError(error?.error?.message ?? 'Error al añadir la película a la lista')
      }); 
  
    }

    onEditar(isPublica: boolean): void {
        if (this.list && this.list.id) {
            this.listaService.editarLista(this.list.id, {... this.list, publica: isPublica}).subscribe({
              next: () => {
                  this.notificationService.showSuccess(isPublica ? 'Lista publicada con éxito' : 'Lista ocultada con exito');
                  this.loadLista();
              },
              error: (err) => this.notificationService.showError( err?.error?.message ?? 'No se pudo editar la lista')
            });     
        }       
    }

}