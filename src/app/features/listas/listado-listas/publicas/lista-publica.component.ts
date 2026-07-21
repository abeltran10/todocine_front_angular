import { Component, EventEmitter, OnInit, output, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardListaComponent } from '../card/publica/lista-card-publica.component';
import { PaginatorComponent } from '../../../../shared/common/paginator/paginator.component';
import { Paginator } from '../../../../core/models/paginator.model';
import { Lista } from '../../../../core/models/lista.model';
import { BehaviorSubject } from 'rxjs';
import { ListaService } from '../../../../core/services/lista.service';




@Component({
  selector: 'app-lista-publica',
  standalone: true,
  imports: [CommonModule, CardListaComponent, PaginatorComponent],
  templateUrl: './lista-publica.component.html'
})
export class PublicListasComponent implements OnInit {
  
  emptyPaginator: Paginator<Lista> =  {results: [], page: 1, total_pages: 1, total_results: 0};

  listas = signal<Paginator<Lista>>(this.emptyPaginator);
    
  success = output<string>();
  error = output<string>();


  constructor(private listaService: ListaService){}

  ngOnInit(): void {
    
    this.loadListas(1); // Carga inicial página 1
  }

  loadListas(pagina: number = 1): void {
    // Al iniciar la búsqueda/cambio de página, subimos el scroll
    window.scrollTo(0,0);

    this.listaService.getListasPublicas(pagina).subscribe({
      next: (paginator) => this.listas.set(paginator),
      error: (error) => {
        this.setErrorMessage(error?.error?.message ?? 'Error cargando las listas');
        this.listas.set(this.emptyPaginator);
      }
    }) 
  }

  setErrorMessage(message: string) {
       this.error.emit(message);
  }
    
  setSuccessMessage(message: string) {
        this.success.emit(message);
  }
}