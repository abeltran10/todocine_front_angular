import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Observable, catchError, of, BehaviorSubject, timer, filter, map, switchMap, tap } from 'rxjs';

import { User } from '../../../core/models/user.model';

import { NavigationBarComponent } from '../../../shared/layout/navigation-bar/navigation-bar.component';
import { HeaderComponent } from '../../../shared/layout/header/header.component';
import { AnyosComponent } from './card/anyos.component';
import { NotificationComponent } from '../../../shared/common/notification/notification.component';

import { PremioService } from '../../../core/services/premio.service';

import { Premio } from '../../../core/models/premio.model';


@Component({
  selector: 'app-premio-anyos',
  standalone: true,
  imports: [
    CommonModule,
    NavigationBarComponent,
    HeaderComponent,
    NotificationComponent,
    AnyosComponent
  ],
  templateUrl: './premio-anyos.component.html'
})
export class PremioAnyosComponent implements OnInit {

  usuario!: User;

  awardSubject = new BehaviorSubject<Premio | null>(null);
  award$ = this.awardSubject.asObservable();

  messageErrorSubject = new BehaviorSubject<string>('');
  errorMessage$ = this.messageErrorSubject.asObservable();

  constructor(private route: ActivatedRoute,
              private premioService: PremioService
  ) {}

 ngOnInit() {
    // Usuario logueado
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
      this.usuario = JSON.parse(loggedUser);
    }

   this.route.paramMap.subscribe(params => {
      const id = Number(params.get('premioId'));
      if (!id) return;
      this.premioService.getPremioById(id).subscribe({
        next: (premio) => this.awardSubject.next(premio),
        error: (error) => {
          this.setErrorMessage(error?.error?.message ?? 'Error al cargar el premio');
        }
      });

    });
  }

  setErrorMessage(message: string) {
    this.messageErrorSubject.next(message);
  
    // Usamos un timer de RxJS que es más compatible con Angular
    timer(5000).subscribe(() => this.messageErrorSubject.next(''));
  }
}

