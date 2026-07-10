import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, timer } from 'rxjs';

import { UserService } from '../../core/services/user.service';

import { CreateAccountFormComponent } from './form/create-account-form.component';
import { HeaderService } from '../../core/services/header.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [
    CommonModule,
    CreateAccountFormComponent
  ],
  templateUrl: './create-account.component.html'
})
export class CreateAccountComponent {

  constructor(private userService: UserService,
              private headerService: HeaderService,
              private notificationService: NotificationService
  ) {
    this.headerService.setTitle('CREAR CUENTA');
  }

  createUser(username: string, password: string) {
    this.userService.createUser({ username, password }).subscribe({
      next: () => this.notificationService.showSuccess('Cuenta creada con éxito'),
      error: (error) => this.notificationService.showError(error?.error?.message ?? 'Error al crear la cuenta')
      
    });
  }

}
