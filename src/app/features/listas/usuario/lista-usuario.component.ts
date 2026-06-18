import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, BehaviorSubject, of, timer, ReplaySubject } from 'rxjs';
import { catchError, shareReplay, switchMap, map } from 'rxjs/operators';

import { CardListaUsuarioComponent } from '../card/usuario/lista-card-usuario.component';
import { PaginatorComponent } from '../../../shared/common/paginator/paginator.component';
import { User } from '../../../core/models/user.model';
import { Paginator } from '../../../core/models/paginator.model';
import { Lista } from '../../../core/models/lista.model';

import { FormsModule } from '@angular/forms';

import { ListaService } from '../../../core/services/lista.service';
import { UsuarioListaService } from '../../../core/services/usuarioLista.service';

@Component({
  selector: 'app-lista-usuario',
  standalone: true,
  imports: [CommonModule, CardListaUsuarioComponent, PaginatorComponent, FormsModule],
  templateUrl: './lista-usuario.component.html'
})
export class UserListasComponent implements OnInit {
  usuario!: User;
  title: string = 'Mis Listas de Películas';

  emptyPaginator: Paginator<Lista> =  {results: [], page: 1, total_pages: 1, total_results: 0};

  listasSubject = new BehaviorSubject<Paginator<Lista>>(this.emptyPaginator);
  listas$ = this.listasSubject.asObservable();
  
  @Output() success = new EventEmitter<string>();
  @Output() error = new EventEmitter<string>();

  listaActual = { id: null, nombre: '', descripcion: '' };
  esEdicion = false;

  constructor(private listaService: ListaService,
              private usuarioListaService: UsuarioListaService    
  ) {}

  ngOnInit(): void {
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
      this.usuario = JSON.parse(loggedUser);
    } 

    this.loadListas(1); // Carga inicial página 1
  }

  loadListas(pagina: number = 1): void {
     this.usuarioListaService.getListasUser(this.usuario.id, pagina).subscribe({
        next: (paginator) => this.listasSubject.next(paginator),
        error: (error) => {
          this.setErrorMessage(error?.error?.message ?? 'Error cargando las listas');
          this.listasSubject.next(this.emptyPaginator);
        }
     })
  }

  // Llamado desde el botón "Crear"
  prepararCreacion() {
    this.esEdicion = false;
    this.limpiarFormulario();
  }

  onSubmitCrear(): void {
    if (this.listaActual.nombre && this.listaActual.descripcion && this.usuario) {
      
      this.listaService.crearLista({ ... this.listaActual, username: this.usuario.username }).subscribe({
        next: () => {
          this.setSuccessMessage('Lista creada con éxito');
          
          // Limpiamos el objeto para la próxima vez
          this.listaActual = { id: null, nombre: '', descripcion: '' };
          
          // Recargamos la primera página
          this.loadListas(1);
        },
        error: (err) => this.setErrorMessage( err?.error?.message ?? 'No se pudo crear la lista')
      });
    }
  }

  // Llamado desde el botón "Editar" (el que ya tenías en tu card)
  prepareLista(lista: any) {
    this.esEdicion = true;
    // Clonamos el objeto para no modificar la card directamente hasta guardar
    this.listaActual = { ...lista }; 
  }

  onSubmitEditar(): void {
    if (this.listaActual.id && this.listaActual.nombre && this.listaActual.descripcion && this.usuario) {
      
      this.listaService.editarLista(this.listaActual.id, {... this.listaActual, username: this.usuario.username}).subscribe({
        next: () => {
          this.setSuccessMessage('Lista editada con éxito');
        
           // Limpiamos el objeto para la próxima vez
          this.listaActual = { id: null, nombre: '', descripcion: ''};
          
          // Recargamos la primera página
          this.loadListas(1);
        },
        error: (err) => this.setErrorMessage( err?.error?.message ?? 'No se pudo editar la lista')
      });
    }
  }

  limpiarFormulario() {
    this.listaActual = { id: null, nombre: '', descripcion: '' };
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