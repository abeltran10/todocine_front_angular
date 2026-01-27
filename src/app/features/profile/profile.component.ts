import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, timer } from 'rxjs';

import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';

import { NavigationBarComponent } from '../../shared/layout/navigation-bar/navigation-bar.component';
import { NotificationComponent } from '../../shared/common/notification/notification.component';
import { HeaderComponent } from '../../shared/layout/header/header.component';
import { ProfileFormComponent } from './form/profile-form.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    NavigationBarComponent,
    NotificationComponent,
    HeaderComponent,
    ProfileFormComponent
  ],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  title = 'PERFIL';

  usuario!: User;

   messageSuccessSubject = new BehaviorSubject<string>('');
    messageErrorSubject = new BehaviorSubject<string>('');
    successMessage$ = this.messageSuccessSubject.asObservable();
    errorMessage$ = this.messageErrorSubject.asObservable();

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
        this.messageErrorSubject.next(message);
    
        // Usamos un timer de RxJS que es más compatible con Angular
        timer(5000).subscribe(() => this.messageErrorSubject.next(''));
  }
    
  setSuccessMessage(message: string) {
        this.messageSuccessSubject.next(message);
    
        // Usamos un timer de RxJS que es más compatible con Angular
        timer(5000).subscribe(() => this.messageSuccessSubject.next(''));
  } 
}
