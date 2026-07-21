import { Component, EventEmitter, output, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-form.component.html'
})
export class LoginFormComponent {

  username = '';
  password = '';

  login = output<{ username: string; password: string }>();
  crearCuenta = output<void>();

  handleLogin() {
    this.login.emit({
      username: this.username,
      password: this.password
    });

    this.username = '';
    this.password = '';
  }

  handleCrearCuenta() {
    this.crearCuenta.emit();
  }
}

