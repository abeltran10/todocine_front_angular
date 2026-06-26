import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Lista } from '../../../../../core/models/lista.model';

@Component({
  selector: 'app-card-lista-publica',
  standalone: true,
  templateUrl: './lista-card-publica.component.html'
})
export class CardListaComponent {
  @Input() lista: Lista | null = null;
  
  constructor(private router: Router) {}

   goToDetail() {
    this.router.navigate(['/app/listas', this.lista?.id]);
  }
  
}