import { Component, OnInit } from '@angular/core';
import { NavigationBarComponent } from '../../../shared/layout/navigation-bar/navigation-bar.component';
import { NotificationComponent } from '../../../shared/common/notification/notification.component';
import { HeaderComponent } from '../../../shared/layout/header/header.component';
import { CommonModule } from '@angular/common';

import { BehaviorSubject, timer } from 'rxjs';


import { User } from '../../../core/models/user.model';

import { GanadorService } from '../../../core/services/ganador.service';

import { GanadorFormComponent } from './form/ganador-form.component';



@Component({
  selector: 'app-ganador-anyadir',
  standalone: true,
  imports: [CommonModule,
            NavigationBarComponent,
            NotificationComponent,
            HeaderComponent,
            GanadorFormComponent
  ],
  templateUrl: './ganador-anyadir.component.html',
})

export class GanadorAnyadirComponent implements OnInit{

  title = 'AÑADIR GANADOR';

  usuario!: User;

  messageErrorSubject = new BehaviorSubject<string>('');
  errorMessage$ = this.messageErrorSubject.asObservable();

  messageSuccessSubject = new BehaviorSubject<string>('');
  successMessage$ = this.messageSuccessSubject.asObservable();

  constructor(private ganadorService: GanadorService) {}

  ngOnInit(): void {
      // usuario logueado
      const loggedUser = localStorage.getItem('loggedUser');
      if (loggedUser) {
        this.usuario = JSON.parse(loggedUser);
      }

  }
  
  async onSubmit(ganador: {
        premioId: number | null;
        categoriaId: number | null;
        anyo: number | null;
        movieId: number | null;
  } ) {
    
    if (ganador.premioId && ganador.anyo && ganador.categoriaId && ganador.movieId) {

       try {
          await this.ganadorService.createGanador(ganador);
          this.setSuccessMessage("Ganador creado correctamente");

       } catch (error: any) {
          this.setErrorMessage(error?.error?.message ?? 'Error guardando el ganador');
       }
       
    } else {
      alert('Por favor, rellena todos los campos');
    }
  }



  setSuccessMessage(message: string) {
    this.messageSuccessSubject.next(message);

    // Usamos un timer de RxJS que es más compatible con Angular
    timer(5000).subscribe(() => this.messageSuccessSubject.next(''));
  }

  setErrorMessage(message: string) {
      this.messageErrorSubject.next(message);
  
      // Usamos un timer de RxJS que es más compatible con Angular
      timer(5000).subscribe(() => this.messageErrorSubject.next(''));
  }
}
