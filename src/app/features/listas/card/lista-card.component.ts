import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Lista } from '../../../core/models/lista.model';

@Component({
  selector: 'app-card-lista',
  standalone: true,
  templateUrl: './lista-card.component.html'
})
export class CardListaComponent {
  @Input() lista: Lista | null = null;

  @Output() onDeleteLista = new EventEmitter<number>();
  
  constructor(private router: Router) {}

   goToDetail() {
    this.router.navigate(['/app/listas', this.lista?.id]);
  }

  borrarLista() {
    this.onDeleteLista.emit(this.lista?.id);
  }
}