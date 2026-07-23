import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges, OnChanges, output, signal, effect, input } from '@angular/core';
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
  @Input() usuario!: User | null;
  @Input() lista!: Lista;
  @Input() moviesList!: Paginator<Movie>

  ordenar = input.required<{ orderBy: string; direction: string }>();  

  errorMessage = output<string>();
  handleMoviesList = output<{ ordenar: any; page: number }>();

  columnaOrden = '';
  ordenAscendente = true;
  
  constructor(
        private listaService: ListaService,
        private router: Router
  ) {
  
    // Sincronizamos automáticamente el estado local cuando cambia el input 'ordenar'
    // sin necesidad de usar ngOnChanges.
    effect(() => {
      const currentOrder = this.ordenar();
      this.columnaOrden = currentOrder.orderBy;
      this.ordenAscendente = currentOrder.direction !== 'desc';
    });
  }


 loadMoviesList(ordenar: any, page: number) {    
    this.handleMoviesList.emit({ ordenar, page });
  }

  eliminarPelicula(movieId: number) {
    if (!this.lista || !this.lista.id) return;
    
    this.listaService.deleteMovieFromList(movieId, this.lista.id).subscribe({
       next: () => {
          const ordenarReset = { orderBy: '', direction: '' };
          this.loadMoviesList(ordenarReset, 1);
       },
       error: (error) => this.setErrorMessage(error?.error?.message ?? 'Error al eliminar la película de la lista')
    });
  }

  handleLoadMovieDetail(movieId: number): void {
    this.router.navigate(['/app/moviedetail', movieId]);
  }

  ordenarPor(columna: string) {
      if (this.columnaOrden === columna) {
        this.ordenAscendente = !this.ordenAscendente;
      } else {
        this.columnaOrden = columna;
        this.ordenAscendente = true;
      }

      const ordenar = { 
        orderBy: this.columnaOrden, 
        direction: this.ordenAscendente ? 'asc' : 'desc' 
      };

      this.loadMoviesList(ordenar, 1);
  }

  getIcono(columna: string): string {
    if (this.columnaOrden !== columna) return 'fa-sort'; 
    return this.ordenAscendente ? 'fa-sort-up' : 'fa-sort-down';
  }

  setErrorMessage(msg: string) {
      this.errorMessage.emit(msg);
  }

  onPageInputChange(value: string, totalPages: number) {
    let page = parseInt(value, 10);
    
    // Si no es un número válido, no hacemos nada
    if (isNaN(page)) return;

    // Validación de límites solicitada
    if (page < 1) {
      page = 1;
    } else if (page > totalPages) {
      page = totalPages;
    }

    // Solo recargamos si la página resultante es distinta a la actual
    if (page !== this.moviesList.page) {
      this.loadMoviesList(this.ordenar(), page);
    }
  }
}