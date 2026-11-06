import { Component, Input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-favoritos-filtros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './favoritos-filtros.component.html'
})
export class FavoritosFiltrosComponent {

  @Input() username!: string | undefined | null;
  @Input() vistaFiltro = '';
  @Input() votadaFiltro = '';
  @Input() order = '';

  filtersChange = output<{
    username: string;
    vistaFiltro: string;
    votadaFiltro: string;
    order: string;
  }>();

  private emitChanges(): void {
    if (!this.username) return;

    this.filtersChange.emit({
      username: this.username,
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
