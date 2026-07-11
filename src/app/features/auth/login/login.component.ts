import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, timer } from 'rxjs';

import { HeaderComponent } from '../../../shared/layout/header/header.component';
import { NotificationComponent } from '../../../shared/layout/notification/notification.component';
import { LoginFormComponent } from './form/login-form.component';

import { LoginService } from '../../../core/services/login.service';

import {User} from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    NotificationComponent,
    LoginFormComponent
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  title = 'TODO CINE';

  successMessage = '';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  async login(event: {username: string; password: string} ) {
    const { username, password } = event;

    try {
      const response = await this.loginService.login({ username, password });
      const user: User = response.body;
         
      this.authService.setToken(response.headers.get('Authorization') ?? '');

      this.authService.setUser(user)

      this.router.navigate(['/app/home'], {
        state: { successMessage: 'Sesión iniciada con exito' }
      });

    } catch (error) {
      this.notificationService.showError('Usuario o contraseña incorrectos');
    }
  }

  crearCuenta() {
    this.router.navigate(['/app/createaccount']);
  }

  get errorMessage$(): Observable<string> {
    return this.notificationService.errorMessage$;
  }

}
