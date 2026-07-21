import { Component, EventEmitter, Input, OnInit, output, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Valoracion } from '../../../../core/models/valoracion.model';
import { User } from '../../../../core/models/user.model';

import { ListaService } from '../../../../core/services/lista.service';
import { BehaviorSubject, catchError, Observable, of, tap, switchMap, shareReplay } from 'rxjs';



@Component({
  selector: 'app-lista-comentarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-comentarios.component.html',
})
export class ListaComentariosComponent implements OnInit {
  @Input() listaId!: number | null | undefined;
  @Input() usuario!: User | null;

  errorMessage = output<string>();

  valoraciones = signal<Valoracion[]>([]);

  // Estado del formulario modernizado con signals
  mostrarFormulario = signal<boolean>(false);
  nuevaPuntuacion = signal<number>(0);
  nuevoComentario = signal<string>('');
  hoverPuntuacion = signal<number>(0); // Para el efecto visual de las estrellas

  constructor(private listaService: ListaService) {}

  ngOnInit(): void {
      this.loadValoraciones();
  }

  loadValoraciones(): void {
      const id = this.listaId;
      if (!id) return;
      
      this.listaService.getValoraciones(id).subscribe({
          next: (valoraciones) => this.valoraciones.set(valoraciones),
          error: (error) => {
            this.errorMessage.emit(error?.error?.message ?? 'Error cargando las valoraciones');
            this.valoraciones.set([]);
          }
      });
  }

  setRating(rating: number): void {
    this.nuevaPuntuacion.set(rating);
  }

  toggleFormulario(): void {
    this.mostrarFormulario.update(value => !value);

    if (this.mostrarFormulario()) {
      const currentUser = this.usuario;
      const reviewPrevia = this.valoraciones().find(v => v.username === currentUser?.username);

      if (reviewPrevia) {
        this.nuevaPuntuacion.set(reviewPrevia.puntuacion);
        this.nuevoComentario.set(reviewPrevia.comentario);
      } else {
        this.nuevaPuntuacion.set(0);
        this.nuevoComentario.set('');
      }
    } else {
      this.nuevaPuntuacion.set(0);
      this.nuevoComentario.set('');
    }
  }

  guardarValoracion(): void {
    const id = this.listaId;

    if (!id || this.nuevaPuntuacion() === 0 || !this.usuario) return;

    const nuevaValoracion: Valoracion = {
      listaId: id,
      username: this.usuario.username,
      puntuacion: this.nuevaPuntuacion(),
      comentario: this.nuevoComentario(),
      fecha: ''
    };
    
    this.listaService.putValoracion(id, nuevaValoracion).subscribe({
        next: () => this.loadValoraciones(),
        error: (error) => this.errorMessage.emit(error?.error?.message ?? 'Error guardando la valoración')
    });
    
    // Resetear formulario
    this.toggleFormulario();
  }
}