import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() listaId: number | null | undefined = null;
  @Input() usuario!: User;

  @Output() errorMessage = new EventEmitter<string>();

  private refreshValoraciones$ = new BehaviorSubject<void>(undefined);
  valoraciones$!: Observable<Valoracion[]>;
  
  reviews: Valoracion[] = [];

  // Estado para el nuevo comentario
  mostrarFormulario = false;
  nuevaPuntuacion = 0;
  nuevoComentario = '';
  hoverPuntuacion = 0; // Para el efecto visual de las estrellas

  constructor(private listaService: ListaService) {
      this.valoraciones$ = this.refreshValoraciones$.pipe(
      switchMap(() => {
        if (!this.listaId) {
          return of([]);
        }

        return this.listaService.getValoraciones(this.listaId).pipe(
          tap((res) => {
            this.reviews = res || [];
          }),
          catchError(error => {
            this.errorMessage.emit(error?.error?.message ?? 'Error cargando las valoraciones');
            return of([]); 
          }),
          shareReplay(1)
        );
      })
    );

  }

  ngOnInit(): void {
    this.loadValoraciones();
  }

  loadValoraciones(): void {
    this.refreshValoraciones$.next();
  }

  setRating(rating: number): void {
    this.nuevaPuntuacion = rating;
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;

    if (this.mostrarFormulario) {
      const reviewPrevia = this.reviews.find(r => r.username === this.usuario?.username);

      if (reviewPrevia) {
        this.nuevaPuntuacion = reviewPrevia.puntuacion;
        this.nuevoComentario = reviewPrevia.comentario;
      } else {
        this.nuevaPuntuacion = 0;
        this.nuevoComentario = '';
      }
    } else {
      this.nuevaPuntuacion = 0;
      this.nuevoComentario = '';
    }
  }

  guardarValoracion(): void {
    if (!this.listaId || this.nuevaPuntuacion === 0) return;

    const nuevaValoracion: Valoracion = {
      listaId: this.listaId,
      username: this.usuario?.username,
      puntuacion: this.nuevaPuntuacion,
      comentario: this.nuevoComentario,
      fecha: ''
    };

    
    this.listaService.putValoracion(this.listaId, nuevaValoracion).pipe(
      catchError(error => {
        this.errorMessage.emit(error?.error?.message ?? 'Error guardando la valoración');
          return of([]);
      })
    ).subscribe(() => {
        this.loadValoraciones();
    })
   
    
    // Resetear formulario
    this.toggleFormulario();
  }
}