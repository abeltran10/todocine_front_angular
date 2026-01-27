import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile-form.component.html'
})
export class ProfileFormComponent {

  @Input() usuario!: User;

  @Output() updateUser = new EventEmitter<{
    username: string;
    password: string;
    passConfirm: string;
  }>();

  password = '';
  passConfirm = '';

  submit() {
    this.updateUser.emit({
      username: this.usuario.username,
      password: this.password,
      passConfirm: this.passConfirm
    });

    // reset campos
    this.password = '';
    this.passConfirm = '';
  }
}
