import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { PaginatorComponent } from '../../../../shared/common/paginator/paginator.component';
import { Paginator } from '../../../../core/models/paginator.model';
import { Movie } from '../../../../core/models/movie.model';

import { ListaService } from '../../../../core/services/lista.service';
import { Lista } from '../../../../core/models/lista.model';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-lista-table',
  standalone: true,
  imports: [CommonModule, 
            PaginatorComponent
  ],
  templateUrl: './lista-table.component.html',
})
export class ListaTableComponent {
  @Input() usuario!: User;
  @Input() lista!: Lista;
  
  @Input() moviesList!: Paginator<Movie>

  @Output() errorMessage = new EventEmitter<string>();
  @Output() handleMoviesList = new EventEmitter<number>();

  constructor(
  private listaService: ListaService,
  private router: Router
) {}


 loadMoviesList(page: number) {
    this.handleMoviesList.emit(page);
  }

  eliminarPelicula(movieId: number) {
    if (!this.lista || !this.lista.id) return;
    this.listaService.deleteMovieFromList(movieId, this.lista.id).pipe(
        catchError(error => {
                  this.setErrorMessage(error?.error?.message ?? 'Error al eliminar la película de la lista');
                  return of(null);
                })
    ).subscribe(() => {
       this.loadMoviesList(1);
    });
  }

    handleLoadMovieDetail(movieId: number): void {
      this.router.navigate(['/app/moviedetail', movieId]);
    }


  setErrorMessage(msg: string) {
      this.errorMessage.emit(msg);
  }
}