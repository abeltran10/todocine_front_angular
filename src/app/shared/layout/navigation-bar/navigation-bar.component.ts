import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { LoginService } from '../../../core/services/login.service';
import { User } from '../../../core/models/user.model';
import { Regions } from '../../../core/enums/regions';
import { Awards } from '../../../core/enums/awards';

@Component({
  selector: 'app-navigation-bar',
  imports: [CommonModule],
  templateUrl: './navigation-bar.component.html'
})
export class NavigationBarComponent {

  @Input() user!: User;
  @Output() error = new EventEmitter<string>();

  regions = Regions.getValues();
  awards = Awards.getValues();

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

  loadCartelera(region: string) {
    this.router.navigate(['/app/cartelera', region]);
  }

  showPremio(premioId: number) {
    this.router.navigate(['/app/premio', premioId]);
  }

  loadFavoritos() {
    this.router.navigate(['/app/favoritos']);
  }

  loadProfile() {
    this.router.navigate(['/app/profile']);
  }
}
