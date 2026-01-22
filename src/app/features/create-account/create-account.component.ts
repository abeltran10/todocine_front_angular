import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  successMessage = '';
  errorMessage = '';

  constructor(private userService: UserService) {}

  async createUser(username: string, password: string) {
    try {
      await this.userService.createUser({ username, password });

      this.successMessage = 'Cuenta creada con éxito';
      setTimeout(() => (this.successMessage = ''), 5000);

    } catch (error: any) {
      this.errorMessage = error?.error?.message ?? 'Error al crear la cuenta';
      setTimeout(() => (this.errorMessage = ''), 5000);
    }
  }
}
