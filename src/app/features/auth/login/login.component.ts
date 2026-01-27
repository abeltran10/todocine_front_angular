import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, timer } from 'rxjs';

import { HeaderComponent } from '../../../shared/layout/header/header.component';
import { NotificationComponent } from '../../../shared/common/notification/notification.component';
import { LoginFormComponent } from './form/login-form.component';

import { LoginService } from '../../../core/services/login.service';

import {User} from '../../../core/models/user.model';

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

  messageErrorSubject = new BehaviorSubject<string>('');
  errorMessage$ = this.messageErrorSubject.asObservable();
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
      this.setErrorMessage('Usuario o contraseña incorrectos');
    }
  }

  crearCuenta() {
    this.router.navigate(['/app/createaccount']);
  }

  setErrorMessage(message: string) {
      this.messageErrorSubject.next(message);
  
      // Usamos un timer de RxJS que es más compatible con Angular
      timer(5000).subscribe(() => this.messageErrorSubject.next(''));
    }
}
