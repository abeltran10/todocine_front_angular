import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-favoritos-filtros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './favoritos-filtros.component.html'
})
export class FavoritosFiltrosComponent {

  @Input() usuarioId!: number;
  @Input() vistaFiltro = '';
  @Input() votadaFiltro = '';
  @Input() order = '';

  @Output() filtersChange = new EventEmitter<{
    usuarioId: number;
    vistaFiltro: string;
    votadaFiltro: string;
    order: string;
  }>();

  emitChanges(): void {
    this.filtersChange.emit({
      usuarioId: this.usuarioId,
      vistaFiltro: this.vistaFiltro,
      votadaFiltro: this.votadaFiltro,
      order: this.order
    });
  }

  handleVista(value: string): void {
    this.vistaFiltro = value;
    this.emitChanges();
  }

  handleVotada(value: string): void {
    this.votadaFiltro = value;
    this.emitChanges();
  }

  handleOrder(value: string): void {
    this.order = value;
    this.emitChanges();
  }
}
