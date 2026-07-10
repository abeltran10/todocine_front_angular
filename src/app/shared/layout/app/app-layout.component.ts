import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { NotificationComponent } from '../notification/notification.component';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    NavigationBarComponent, 
    NotificationComponent, 
    HeaderComponent
  ],
  templateUrl: './app-layout.component.html'
})
export class AppLayoutComponent {
  title = 'TODO CINE';

  constructor(
    public authService: AuthService,
    public notificationService: NotificationService
  ) {}
}