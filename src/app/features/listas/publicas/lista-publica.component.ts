import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardListaComponent } from '../card/publica/lista-card-publica.component';
import { PaginatorComponent } from '../../../shared/common/paginator/paginator.component';
import { User } from '../../../core/models/user.model';
import { Paginator } from '../../../core/models/paginator.model';
import { Lista } from '../../../core/models/lista.model';
import { BehaviorSubject, catchError, Observable, of, ReplaySubject, shareReplay, switchMap, timer } from 'rxjs';
import { ListaService } from '../../../core/services/lista.service';



@Component({
  selector: 'app-lista-publica',
  standalone: true,
  imports: [CommonModule, CardListaComponent, PaginatorComponent],
  templateUrl: './lista-publica.component.html'
})
export class PublicListasComponent implements OnInit {
  usuario!: User;
  title: string = 'Listas Públicas';
  listas$!: Observable<Paginator<Lista>>;
  
 @Output() success = new EventEmitter<string>();
 @Output() error = new EventEmitter<string>();

  private refreshListas = new ReplaySubject<number>(1);


  constructor(private listaService: ListaService) {
      this.listas$ = this.refreshListas.pipe(
        switchMap(pagina => this.listaService.getListasPublicas(pagina)),
        shareReplay(1),
        catchError(error => {
               this.setErrorMessage(error?.error?.message ?? 'Error cargando las listas');
               return of({ results: [], page: 1, total_pages: 1, total_results: 0 });
             }
        )
      )
  }

  ngOnInit(): void {
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
      this.usuario = JSON.parse(loggedUser);
    } 

    this.loadListas(1); // Carga inicial página 1
  }

  loadListas(pagina: number = 1): void {
    this.refreshListas.next(pagina); 
  }

  setErrorMessage(message: string) {
       this.error.emit(message);
  }
    
  setSuccessMessage(message: string) {
        this.success.emit(message);
  }
}