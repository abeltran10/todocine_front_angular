import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  @Output() createUser = new EventEmitter<{
    username: string;
    password: string;
  }>();

  submit() {
    if (this.password === this.passConfirm) {
      this.createUser.emit({
        username: this.username,
        password: this.password
      });

      this.username = '';
      this.password = '';
      this.passConfirm = '';
    }
  }

  get passwordsDontMatch(): boolean {
    return (
      this.passConfirm !== '' &&
      this.password !== this.passConfirm
    );
  }
}
