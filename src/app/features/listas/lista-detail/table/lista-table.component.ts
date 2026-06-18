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

  ordenColumna: string = '';
  ordenAscendente: boolean = true;

  constructor(
  private listaService: ListaService,
  private router: Router
) {}


 loadMoviesList(page: number) {
    this.handleMoviesList.emit(page);
  }

  eliminarPelicula(movieId: number) {
    if (!this.lista || !this.lista.id) return;
    this.listaService.deleteMovieFromList(movieId, this.lista.id).subscribe({
       next: () => this.loadMoviesList(1),
       error: (error) => this.setErrorMessage(error?.error?.message ?? 'Error al eliminar la película de la lista')
    })
  }

    handleLoadMovieDetail(movieId: number): void {
      this.router.navigate(['/app/moviedetail', movieId]);
    }


  ordenarPor(columna: string) {
      // Si clicamos en la misma columna, cambiamos el sentido
      if (this.ordenColumna === columna) {
        this.ordenAscendente = !this.ordenAscendente;
      } else {
        this.ordenColumna = columna;
        this.ordenAscendente = true;
      }

      // Lógica de ordenamiento
      this.moviesList.results.sort((a: any, b: any) => {
        let valorA = columna === 'release_date' ? new Date(a[columna]).getTime() : a[columna];
        let valorB = columna === 'release_date' ? new Date(b[columna]).getTime() : b[columna];
        
        // Comparación básica
        if (valorA < valorB) return this.ordenAscendente ? -1 : 1;
        if (valorA > valorB) return this.ordenAscendente ? 1 : -1;

        return 0;
      });

  }

  getIcono(columna: string): string {
    if (this.ordenColumna !== columna) return 'fa-sort'; // Icono neutro
    return this.ordenAscendente ? 'fa-sort-up' : 'fa-sort-down';
  }

  setErrorMessage(msg: string) {
      this.errorMessage.emit(msg);
  }
}