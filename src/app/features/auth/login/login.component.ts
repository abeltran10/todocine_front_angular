import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { HeaderComponent } from '../../../shared/layout/header/header.component';
import { NotificationComponent } from '../../../shared/common/notification/notification.component';
import { LoginFormComponent } from './login-form.component';

import { LoginService } from '../../../core/services/login.service';

import {User} from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    HeaderComponent,
    NotificationComponent,
    LoginFormComponent
  ],
  template: `
    <app-notification
      [successMessage]="successMessage"
      [errorMessage]="errorMessage">
    </app-notification>

    <app-header [title]="title"></app-header>

    <app-login-form
      (login)="login($event)"
      (crearCuenta)="crearCuenta()">
    </app-login-form>
  `
})
export class LoginComponent {

  title = 'TODO CINE';

  errorMessage = '';
  successMessage = '';

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  async login(event: {username: string; password: string} ) {
    const { username, password } = event;

    try {
      const response = await this.loginService.login({ username, password });
      const user: User = response.body;
      
      localStorage.setItem(
        'loggedUserToken',
        response.headers.get('Authorization') ?? ''
      );
      localStorage.setItem(
        'loggedUser',
        JSON.stringify(user)
      );

      this.router.navigate(['/app/home'], {
        state: { successMessage: 'Inicio de sesión exitoso' }
      });

    } catch (error) {
      this.errorMessage = 'Usuario o contraseña incorrectos';
      setTimeout(() => this.errorMessage = '', 5000);
    }
  }

  crearCuenta() {
    this.router.navigate(['/app/createaccount']);
  }
}
