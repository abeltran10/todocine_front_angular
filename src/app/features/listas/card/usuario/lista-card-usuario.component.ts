import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Lista } from '../../../../core/models/lista.model';

@Component({
  selector: 'app-card-lista-usuario',
  standalone: true,
  templateUrl: './lista-card-usuario.component.html'
})
export class CardListaUsuarioComponent {
  @Input() lista: Lista | null = null;

  @Output() onDeleteLista = new EventEmitter<number>();

  @Output() onEditLista = new EventEmitter<Lista>();
  
  constructor(private router: Router) {}

   goToDetail() {
    this.router.navigate(['/app/listas', this.lista?.id]);
  }

  borrarLista() {
    if (this.lista?.id) 
      this.onDeleteLista.emit(this.lista.id);
  }

  editarLista() {
    if (this.lista)
      this.onEditLista.emit(this.lista);
      
  }
  
}