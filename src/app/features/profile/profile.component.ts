import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, timer } from 'rxjs';

import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';

import { HeaderComponent } from '../../shared/layout/header/header.component';
import { ProfileFormComponent } from './form/profile-form.component';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ProfileFormComponent
  ],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  usuario!: User | null;
  title = 'PERFIL';

  constructor(private userService: UserService,
              private authService: AuthService,
              private notificationService: NotificationService   
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.currentUser;
  }

  updateUser(username: string, password: string, passConfirm: string) {
    if (!this.usuario) return;

    if (password !== passConfirm) {
      this.notificationService.showError('Las password no coinciden');
      return;
    }
    
    const updatedUser: User = {
      ...this.usuario,
      username,
      password
    };

    this.userService.updateUser(updatedUser).subscribe({
      next: (user) => {
          this.authService.setUser(user);
          this.usuario = this.authService.currentUser;

          this.notificationService.showSuccess('Usuario actualizado con éxito');
      },
      error: (error) => this.notificationService.showError(error?.error?.message ?? 'Error actualizando usuario')
    });
  }    

}
