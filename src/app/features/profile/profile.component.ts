import { Component, OnInit } from '@angular/core';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  title = 'PERFIL';

  usuario!: User;

  successMessage = '';
  errorMessage = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      this.usuario = JSON.parse(storedUser);
    }
  }

  async updateUser(username: string, password: string, passConfirm: string) {

    if (password !== passConfirm) {
      this.setErrorMessage('Las password no coinciden');
      return;
    }

    try {
      const updatedUser: User = {
        ...this.usuario,
        username,
        password
      };

      const response: User = await this.userService.updateUser(updatedUser);

      localStorage.setItem('loggedUser', JSON.stringify(response));
      this.usuario = response;

      this.setSuccessMessage('Usuario actualizado con éxito');

    } catch (error: any) {
      this.setErrorMessage(error?.error?.message ?? 'Error actualizando usuario');
    }
  }

  setErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = '', 5000);
  }

  setSuccessMessage(message: string) {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 5000);
  }
}
