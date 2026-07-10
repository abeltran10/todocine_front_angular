import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, timer } from 'rxjs';

import { UserService } from '../../core/services/user.service';

import { CreateAccountFormComponent } from './form/create-account-form.component';
import { HeaderComponent } from '../../shared/layout/header/header.component';
import { NotificationComponent } from '../../shared/layout/notification/notification.component';


@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [
    CommonModule,
    CreateAccountFormComponent,
    HeaderComponent,
    NotificationComponent
  ],
  templateUrl: './create-account.component.html'
})
export class CreateAccountComponent {

  title: string = 'TODO CINE'

  messageErrorSubject = new BehaviorSubject<string>('');
  errorMessage$ = this.messageErrorSubject.asObservable();

  messageSuccessSubject = new BehaviorSubject<string>('');
  successMessage$ = this.messageSuccessSubject.asObservable();

  constructor(private userService: UserService) {
  }

  createUser(username: string, password: string) {
    this.userService.createUser({ username, password }).subscribe({
      next: () => this.setSuccessMessage('Cuenta creada con éxito'),
      error: (error) => this.setErrorMessage(error?.error?.message ?? 'Error al crear la cuenta')
      
    });
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
