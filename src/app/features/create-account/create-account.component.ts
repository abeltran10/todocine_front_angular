import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { UserService } from '../../core/services/user.service';

import { CreateAccountFormComponent } from './form/create-account-form.component';
import { HeaderComponent } from '../../shared/layout/header/header.component';
import { NotificationComponent } from '../../shared/layout/notification/notification.component';
import { NotificationService } from '../../core/services/notification.service';


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

  constructor(private userService: UserService,
              private notificationService: NotificationService
  ) {
  }

  createUser(username: string, password: string) {
    this.userService.createUser({ username, password }).subscribe({
      next: () => this.notificationService.showSuccess('Cuenta creada con éxito'),
      error: (error) => this.notificationService.showError(error?.error?.message ?? 'Error al crear la cuenta')
      
    });
  }

  get successMessage$(): Observable<string> {
      return this.notificationService.success$;
  }

  get errorMessage$(): Observable<string> {
      return this.notificationService.errorMessage$;
  }

}
