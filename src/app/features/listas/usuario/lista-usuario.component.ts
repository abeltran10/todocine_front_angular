import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioListaService } from '../../../core/services/usuarioLista.service';
import { ListaService } from '../../../core/services/lista.service';
import { Observable, BehaviorSubject, of, timer, ReplaySubject } from 'rxjs';
import { catchError, shareReplay, switchMap, map } from 'rxjs/operators';

import { CardListaUsuarioComponent } from '../card/usuario/lista-card-usuario.component';
import { PaginatorComponent } from '../../../shared/common/paginator/paginator.component';
import { User } from '../../../core/models/user.model';
import { Paginator } from '../../../core/models/paginator.model';
import { Lista } from '../../../core/models/lista.model';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-usuario',
  standalone: true,
  imports: [CommonModule, CardListaUsuarioComponent, PaginatorComponent, FormsModule],
  templateUrl: './lista-usuario.component.html'
})
export class UserListasComponent implements OnInit {
  usuario!: User;
  title: string = 'Mis Listas de Películas';
  listas$!: Observable<Paginator<Lista>>;
  
  @Output() success = new EventEmitter<string>();
  @Output() error = new EventEmitter<string>();

  private refreshListas = new ReplaySubject<number>(1);

  nuevaLista = { nombre: '', descripcion: '' };

  editLista: Lista = {
    id: undefined,
    nombre: '',
    descripcion: '',
    movies: undefined,
    username: '',
  }; 

  constructor(private usuarioListaService: UsuarioListaService,
              private listaService: ListaService    
  ) {
      this.listas$ = this.refreshListas.pipe(
        switchMap(pagina => this.usuarioListaService.getListas(this.usuario.id, pagina)),
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

  onSubmitCrear(): void {
    if (this.nuevaLista.nombre && this.nuevaLista.descripcion && this.usuario) {
      
      this.listaService.crearLista({ ... this.nuevaLista, username: this.usuario.username }).subscribe({
        next: () => {
          this.setSuccessMessage('Lista creada con éxito');
          
          // Limpiamos el objeto para la próxima vez
          this.nuevaLista = { nombre: '', descripcion: '' };
          
          // Recargamos la primera página
          this.loadListas(1);
        },
        error: (err) => this.setErrorMessage( err?.error?.message ?? 'No se pudo crear la lista')
      });
    }
  }

  prepareLista(lista: Lista) {
    this.editLista = { ... lista }
  }

  onSubmitEditar(): void {
    if (this.editLista.id && this.editLista.nombre && this.editLista.descripcion && this.editLista.username) {
      
      this.listaService.editarLista(this.editLista.id, this.editLista).subscribe({
        next: () => {
          this.setSuccessMessage('Lista editada con éxito');
        
           // Limpiamos el objeto para la próxima vez
          this.editLista = { id: undefined, nombre: '', descripcion: '', movies: undefined, username: '' };
          
          // Recargamos la primera página
          this.loadListas(1);
        },
        error: (err) => this.setErrorMessage( err?.error?.message ?? 'No se pudo editar la lista')
      });
    }
  }

  onDeleteLista(listaId: number) {
     this.listaService.borrarLista(listaId).subscribe({
        next: () => {
          this.setSuccessMessage('Lista eliminada con exito')  

          // Recargamos la primera página
          this.loadListas(1);
        },
        
        error: (err) => this.setErrorMessage( err?.error?.message ?? 'Error eliminando la lista')
     }); 
  }

  setErrorMessage(message: string) {
       this.error.emit(message);
  }
    
  setSuccessMessage(message: string) {
        this.success.emit(message);
  }

}