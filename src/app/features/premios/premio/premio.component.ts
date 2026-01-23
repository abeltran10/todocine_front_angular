import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PremioService } from '../../../core/services/premio.service';

import { Awards, AwardKey } from '../../../core/enum/awards'; 

import { NavigationBarComponent } from '../../../shared/layout/navigation-bar/navigation-bar.component';
import { NotificationComponent } from '../../../shared/common/notification/notification.component';
import { HeaderComponent } from '../../../shared/layout/header/header.component';
import { PaginatorComponent } from '../../../shared/layout/paginator/paginator.component';
import { GanadorComponent } from '../ganador/ganador.component';

import { User } from '../../../core/models/user.model';
import { Paginator } from '../../../core/models/paginator.model';
import { Ganador } from '../../../core/models/ganador.model';

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

  usuario!: User;

  successMessage = '';
  errorMessage = '';

  premioCod!: number;
  premioAnyo!: number;

  title = '';

  ganadores: Paginator<Ganador> | null = null;

  constructor(
    private route: ActivatedRoute,
    private premioService: PremioService
  ) {}

  ngOnInit(): void {
    // usuario logueado
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
      this.usuario = JSON.parse(loggedUser);
    }

    // params
    this.route.paramMap.subscribe(params => {
      this.premioCod = Number(params.get('premioCod'));
      this.premioAnyo = Number(params.get('premioAnyo'));

      const award = Awards.getAwards(String(this.premioCod) as AwardKey);
      this.title = `${award.award.toUpperCase()} ${this.premioAnyo}`;

      this.loadPremio(1);
    });
  }

  async loadPremio(page: number): Promise<void> {
    try {
      this.ganadores = await this.premioService.getPremiosByCodigoAnyo(
        this.premioCod,
        this.premioAnyo,
        page
      );
    } catch (error: any) {
      this.errorMessage = error?.error?.message ?? 'Error al cargar premios';
      setTimeout(() => (this.errorMessage = ''), 5000);
    }
  }

  /** filas de 3 ganadores */
  get rows(): (Ganador | null)[][] {
    if (!this.ganadores) return [];

    const rows: (Ganador | null)[][] = [];
    const results = this.ganadores.results;

    for (let i = 0; i < results.length; i += 3) {
      const row: (Ganador | null)[] = results.slice(i, i + 3);
      while (row.length < 3) {
        row.push(null);
      }
      rows.push(row);
    }

    return rows;
  }
}
