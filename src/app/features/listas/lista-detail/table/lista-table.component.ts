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
  @Output() handleMoviesList = new EventEmitter<{ordenar: any, page: number}>();

  @Input() ordenar!: any;
  
  ordenAscendente: boolean = this.ordenar?.direction !== 'desc' ? true : false;

  
  constructor(
  private listaService: ListaService,
  private router: Router
) {}


 loadMoviesList(ordenar: any, page: number) {    
    this.handleMoviesList.emit({ordenar, page});
  }

  eliminarPelicula(movieId: number) {
    if (!this.lista || !this.lista.id) return;
    this.listaService.deleteMovieFromList(movieId, this.lista.id).subscribe({
       next: () => {
          const ordenar = {orderBy: '', direction: ''};
          this.loadMoviesList(ordenar, 1);
          
       },
       error: (error) => this.setErrorMessage(error?.error?.message ?? 'Error al eliminar la película de la lista')
    })
  }

    handleLoadMovieDetail(movieId: number): void {
      this.router.navigate(['/app/moviedetail', movieId]);
    }


  ordenarPor(columna: string) {
      // Si clicamos en la misma columna, cambiamos el sentido
      if (this.ordenar.orderBy === columna) {
        this.ordenAscendente = !this.ordenAscendente;
      } else {
        this.ordenar.orderBy = columna;
        this.ordenAscendente = true;
      }

      const ordenar = {... this.ordenar, direction: this.ordenAscendente ? "asc" : "desc"};

      this.loadMoviesList(ordenar, 1);
  }

  getIcono(columna: string): string {
    if (this.ordenar.orderBy !== columna) return 'fa-sort'; // Icono neutro
    return this.ordenAscendente ? 'fa-sort-up' : 'fa-sort-down';
  }

  setErrorMessage(msg: string) {
      this.errorMessage.emit(msg);
  }
}