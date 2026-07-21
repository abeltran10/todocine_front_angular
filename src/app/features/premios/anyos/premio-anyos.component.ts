import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Observable, catchError, of, BehaviorSubject, timer, filter, map, switchMap, tap } from 'rxjs';

import { User } from '../../../core/models/user.model';

import { HeaderComponent } from '../../../shared/layout/header/header.component';
import { AnyosComponent } from './card/anyos.component';

import { PremioService } from '../../../core/services/premio.service';

import { Premio } from '../../../core/models/premio.model';
import { NotificationService } from '../../../core/services/notification.service';


@Component({
  selector: 'app-premio-anyos',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    AnyosComponent,
    HeaderComponent
  ],
  templateUrl: './premio-anyos.component.html'
})
export class PremioAnyosComponent implements OnInit {
  award = signal<Premio | null>(null);

  constructor(private route: ActivatedRoute,
              private premioService: PremioService,
              private notificationService: NotificationService
  ) {}

 ngOnInit() {
   
   this.route.paramMap.subscribe(params => {
      const id = Number(params.get('premioId'));
      if (!id) return;
      this.premioService.getPremioById(id).subscribe({
        next: (premio) => {
           this.award.set(premio);
        },
        error: (error) => {
          this.notificationService.showError(error?.error?.message ?? 'Error al cargar el premio');
        }
      });

    });
  }

}

