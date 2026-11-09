import { Component, EventEmitter, output, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-create-account-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-account-form.component.html'
})
export class CreateAccountFormComponent {

  username = '';
  password = '';
  passConfirm = '';

  createUser = output<{
    username: string;
    password: string;
  }>();

  constructor(public notificationService: NotificationService) {}

  submit() {
    const sinEspaciosNiVacido = (valor: string) => /^\S+$/.test(valor);

    if (
      sinEspaciosNiVacido(this.username) && 
      sinEspaciosNiVacido(this.password) && 
      this.password === this.passConfirm
    ) {

      this.createUser.emit({
        username: this.username,
        password: this.password
      });

      this.username = '';
      this.password = '';
      this.passConfirm = '';
    } else {
        this.notificationService.showError('Username o password contienen espacios en blanco');
    }
  }

  get passwordsDontMatch(): boolean {
    return (
      this.passConfirm !== '' &&
      this.password !== this.passConfirm
    );
  }

  
}
