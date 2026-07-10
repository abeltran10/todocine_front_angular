import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, catchError, of, BehaviorSubject, timer } from 'rxjs';

import { GanadorService } from '../../../core/services/ganador.service';

import { NavigationBarComponent } from '../../../shared/layout/navigation-bar/navigation-bar.component';
import { NotificationComponent } from '../../../shared/layout/notification/notification.component';
import { HeaderComponent } from '../../../shared/layout/header/header.component';
import { PaginatorComponent } from '../../../shared/common/paginator/paginator.component';
import { GanadorComponent } from './card/ganador.component';

import { User } from '../../../core/models/user.model';
import { Paginator } from '../../../core/models/paginator.model';
import { Ganador } from '../../../core/models/ganador.model';
import { PremioService } from '../../../core/services/premio.service';
import { HeaderService } from '../../../core/services/header.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-premio',
  standalone: true,
  imports: [
    CommonModule,
    NavigationBarComponent,
    NotificationComponent,
    HeaderComponent,
    PaginatorComponent,
    GanadorComponent
  ],
  templateUrl: './premio.component.html'
})
export class PremioComponent implements OnInit {

  premioCod!: number;
  premioAnyo!: number;

  title = '';

  emptyPaginator: Paginator<Ganador> = {
          results: [], page: 1, total_pages: 1, total_results: 0
      }

  ganadoresSubject = new BehaviorSubject<Paginator<Ganador> | null>(null);
  ganadores$ = this.ganadoresSubject.asObservable();

  constructor(
    private route: ActivatedRoute,
    private ganadorService: GanadorService,
    private premioService: PremioService,
    private headerService: HeaderService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {

    // params
    this.route.paramMap.subscribe(params => {
      // 1. Extraemos los datos de la URL
      this.premioCod = Number(params.get('premioCod'));
      this.premioAnyo = Number(params.get('premioAnyo'));      

      // 2. Solo si tenemos el código, disparamos la petición
      if (this.premioCod && this.premioAnyo) {
        this.premioService.getPremioById(this.premioCod).subscribe({
           next: (premio) => {
                if (premio) {
                  this.headerService.setTitle(`${premio.titulo.toUpperCase()} ${this.premioAnyo}`);
                }
            },
            error: (error) => {
              this.notificationService.showError(error?.error?.message ?? 'Error cargando el premio');
            }
        })
     
        this.loadPremio(1);
      }
    }); 
  }

  loadPremio(page: number) {
    this.ganadorService.getGanadoresByPremioIdAnyo(
        this.premioCod,
        this.premioAnyo,
        page
      ).subscribe({
          next: (paginator) => this.ganadoresSubject.next(paginator),
          error: (error) => {
            this.notificationService.showError(error?.error?.message ?? 'Error cargando los premios');
            this.ganadoresSubject.next(this.emptyPaginator);
          }
      });
  }
}
