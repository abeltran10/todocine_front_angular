import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, timer } from 'rxjs';

import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';

import { NavigationBarComponent } from '../../shared/layout/navigation-bar/navigation-bar.component';
import { NotificationComponent } from '../../shared/layout/notification/notification.component';
import { HeaderComponent } from '../../shared/layout/header/header.component';
import { ProfileFormComponent } from './form/profile-form.component';
import { AuthService } from '../../core/services/auth.service';
import { HeaderService } from '../../core/services/header.service';
import { NotificationService } from '../../core/services/notification.service';

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
  usuario!: User | null;


  constructor(private userService: UserService,
              private authService: AuthService,
              private headerService: HeaderService,
              private notificationService: NotificationService   
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.currentUser;

    this.headerService.setTitle('PERFIL');
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
          this.usuario = user;

          this.notificationService.showSuccess('Usuario actualizado con éxito');
      },
      error: (error) => this.notificationService.showError(error?.error?.message ?? 'Error actualizando usuario')
    });
  }    

}
