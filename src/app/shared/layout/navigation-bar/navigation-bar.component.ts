import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

import { LoginService } from '../../../core/services/login.service';
import { User } from '../../../core/models/user.model';
import { Region, Regions } from '../../../core/enum/regions';
import { Award, Awards } from '../../../core/enum/awards';
@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule

  ],
  templateUrl: './navigation-bar.component.html'
})
export class NavigationBarComponent {

  @Input() user!: User;
  @Output() error = new EventEmitter<string>();

  regions: Region[] = Regions.getValues();
  awards: Award[] = Awards.getValues();


  constructor(
    private router: Router,
    private loginService: LoginService
  ) {}

  async logout() {
    try {
      await this.loginService.logout();

      localStorage.removeItem('loggedUserToken');
      localStorage.removeItem('loggedUser');

      this.router.navigate(['/app']);
    } catch (error) {
      this.error.emit('Error al abandonar la sesión');
    }
  }

}
