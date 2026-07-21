import { Component, EventEmitter, OnInit, output, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardListaUsuarioComponent } from '../card/usuario/lista-card-usuario.component';
import { PaginatorComponent } from '../../../../shared/common/paginator/paginator.component';
import { User } from '../../../../core/models/user.model';
import { Paginator } from '../../../../core/models/paginator.model';
import { Lista } from '../../../../core/models/lista.model';

import { FormsModule } from '@angular/forms';

import { ListaService } from '../../../../core/services/lista.service';
import { UsuarioListaService } from '../../../../core/services/usuarioLista.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-lista-usuario',
  standalone: true,
  imports: [CommonModule, CardListaUsuarioComponent, PaginatorComponent, FormsModule],
  templateUrl: './lista-usuario.component.html'
})
export class UserListasComponent implements OnInit {
  usuario!: User | null;
  
  emptyPaginator: Paginator<Lista> =  {results: [], page: 1, total_pages: 1, total_results: 0};

  listas = signal<Paginator<Lista>>(this.emptyPaginator);
    
  success = output<string>();
  error = output<string>();

  listaActual = { id: null, nombre: '', descripcion: '' };
  esEdicion = signal<boolean>(false);

  constructor(private listaService: ListaService,
              private usuarioListaService: UsuarioListaService,
              private authService: AuthService    
  ) {}

  ngOnInit(): void {
   this.usuario = this.authService.currentUser;

   this.loadListas(1); // Carga inicial página 1
  }

  loadListas(pagina: number = 1): void {
    if (!this.usuario) return;

    // Al iniciar la búsqueda/cambio de página, subimos el scroll
    window.scrollTo(0,0);

     this.usuarioListaService.getListasUser(this.usuario.id, pagina).subscribe({
        next: (paginator) => this.listas.set(paginator),
        error: (error) => {
          this.setErrorMessage(error?.error?.message ?? 'Error cargando las listas');
          this.listas.set(this.emptyPaginator);
        }
     })
  }

  // Llamado desde el botón "Crear"
  prepararCreacion() {
    this.esEdicion.set(false);
    this.limpiarFormulario();
  }

  onSubmitCrear(): void {
    if (this.listaActual.nombre && this.listaActual.descripcion && this.usuario) {
      
      this.listaService.crearLista({ ... this.listaActual, username: this.usuario.username }).subscribe({
        next: () => {
          this.setSuccessMessage('Lista creada con éxito');
          
          this.limpiarFormulario();
          
          // Recargamos la primera página
          this.loadListas(1);
        },
        error: (err) => this.setErrorMessage( err?.error?.message ?? 'No se pudo crear la lista')
      });
    }
  }

  prepareLista(lista: any) {
    this.esEdicion.set(true);
    // Clonamos el objeto para no modificar la card directamente hasta guardar
    this.listaActual = { ...lista }; 
  }

  onSubmitEditar(): void {
    if (this.listaActual.id && this.listaActual.nombre && this.listaActual.descripcion && this.usuario) {
      
      this.listaService.editarLista(this.listaActual.id, {... this.listaActual, username: this.usuario.username}).subscribe({
        next: () => {
          this.setSuccessMessage('Lista editada con éxito');
        
          this.limpiarFormulario();
          
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