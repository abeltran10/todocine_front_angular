import { Component, OnInit } from '@angular/core';
import { NavigationBarComponent } from '../../../shared/layout/navigation-bar/navigation-bar.component';
import { NotificationComponent } from '../../../shared/layout/notification/notification.component';
import { HeaderComponent } from '../../../shared/layout/header/header.component';
import { CommonModule } from '@angular/common';

import { GanadorService } from '../../../core/services/ganador.service';

import { GanadorFormComponent } from './form/ganador-form.component';
import { HeaderService } from '../../../core/services/header.service';
import { NotificationService } from '../../../core/services/notification.service';



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

export class GanadorAnyadirComponent {
  title = 'AÑADIR GANADOR';

  constructor(private ganadorService: GanadorService,
              private notificationService: NotificationService
  ) {}
  
  async onSubmit(ganador: {
        premioId: number | null;
        categoriaId: number | null;
        anyo: number | null;
        movieId: number | null;
  } ) {
    
    if (ganador.premioId && ganador.anyo && ganador.categoriaId && ganador.movieId) {
       this.ganadorService.createGanador(ganador).subscribe({
            next: () => this.notificationService.showSuccess("Ganador creado correctamente"),
            error: (error) =>  this.notificationService.showError(error?.error?.message ?? 'Error guardando el ganador')
          });
                 
    } else {
      alert('Por favor, rellena todos los campos');
    }
  }

}
