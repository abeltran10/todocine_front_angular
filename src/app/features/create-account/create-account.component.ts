import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, timer } from 'rxjs';

import { UserService } from '../../core/services/user.service';

import { HeaderComponent } from '../../shared/layout/header/header.component';
import { NotificationComponent } from '../../shared/common/notification/notification.component';
import { CreateAccountFormComponent } from './form/create-account-form.component';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    NotificationComponent,
    CreateAccountFormComponent
  ],
  templateUrl: './create-account.component.html'
})
export class CreateAccountComponent {

  title = 'CREAR CUENTA';

  messageSuccessSubject = new BehaviorSubject<string>('');
  messageErrorSubject = new BehaviorSubject<string>('');
  errorMessage$ = this.messageErrorSubject.asObservable();
  successMessage$ = this.messageSuccessSubject.asObservable();

  constructor(private userService: UserService) {}

  async createUser(username: string, password: string) {
    try {
      await this.userService.createUser({ username, password });

      this.setSuccessMessage('Cuenta creada con éxito');

    } catch (error: any) {
      this.setErrorMessage(error?.error?.message ?? 'Error al crear la cuenta');
    }
  }

  setErrorMessage(message: string) {
    this.messageErrorSubject.next(message);

    // Usamos un timer de RxJS que es más compatible con Angular
    timer(5000).subscribe(() => this.messageErrorSubject.next(''));
  }

  setSuccessMessage(message: string) {
    this.messageSuccessSubject.next(message);

    // Usamos un timer de RxJS que es más compatible con Angular
    timer(5000).subscribe(() => this.messageSuccessSubject.next(''));
  }
}
