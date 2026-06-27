import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardListaComponent } from '../card/publica/lista-card-publica.component';
import { PaginatorComponent } from '../../../../shared/common/paginator/paginator.component';
import { User } from '../../../../core/models/user.model';
import { Paginator } from '../../../../core/models/paginator.model';
import { Lista } from '../../../../core/models/lista.model';
import { BehaviorSubject, catchError, Observable, of, ReplaySubject, shareReplay, switchMap, timer } from 'rxjs';
import { ListaService } from '../../../../core/services/lista.service';



@Component({
  selector: 'app-lista-publica',
  standalone: true,
  imports: [CommonModule, CardListaComponent, PaginatorComponent],
  templateUrl: './lista-publica.component.html'
})
export class PublicListasComponent implements OnInit {
  usuario!: User;
  title: string = 'Listas Públicas';

  emptyPaginator: Paginator<Lista> =  {results: [], page: 1, total_pages: 1, total_results: 0};

  listasSubject = new BehaviorSubject<Paginator<Lista>>(this.emptyPaginator);
  listas$ =  this.listasSubject.asObservable();
  
 @Output() success = new EventEmitter<string>();
 @Output() error = new EventEmitter<string>();


  constructor(private listaService: ListaService) {}

  ngOnInit(): void {
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
      this.usuario = JSON.parse(loggedUser);
    } 

    this.loadListas(1); // Carga inicial página 1
  }

  loadListas(pagina: number = 1): void {
    this.listaService.getListasPublicas(pagina).subscribe({
      next: (paginator) => this.listasSubject.next(paginator),
      error: (error) => {
        this.setErrorMessage(error?.error?.message ?? 'Error cargando las listas');
        this.listasSubject.next(this.emptyPaginator);
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