import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Observable, catchError, of, BehaviorSubject, timer, filter, map, switchMap, tap } from 'rxjs';

import { User } from '../../../core/models/user.model';

import { NavigationBarComponent } from '../../../shared/layout/navigation-bar/navigation-bar.component';
import { HeaderComponent } from '../../../shared/layout/header/header.component';
import { AnyosComponent } from './anyos.component';
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

  award$!: Observable<Premio | null>;
  rows: number[][] = [];
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

   // 2. Definimos el flujo de award$ de forma reactiva
    this.award$ = this.route.paramMap.pipe(
      map(params => Number(params.get('premioId'))),
      filter(id => !!id), // Si el id es 0 o null, se detiene aquí
      switchMap(id => this.premioService.getPremioById(id).pipe(
        tap(premio => {
          this.buildRows(premio.anyos ?? [])
        }),
        catchError(error => {
          this.setErrorMessage(error?.error?.message ?? 'Error al cargar el premio');
          return of(null);
        })
      ))
    );
  }

  private buildRows(anyos: number[]): void {
    this.rows = [];

    for (let i = 0; i < anyos.length; i += 3) {
      this.rows.push(anyos.slice(i, i + 3));
    }
  }

  setErrorMessage(message: string) {
    this.messageErrorSubject.next(message);
  
    // Usamos un timer de RxJS que es más compatible con Angular
    timer(5000).subscribe(() => this.messageErrorSubject.next(''));
  }
}

