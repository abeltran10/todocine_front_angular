import { Component, OnInit, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

import { LoginService } from '../../../core/services/login.service';
import { User } from '../../../core/models/user.model';
import { Region, Regions } from '../../../core/enum/regions';
import { PremioService } from '../../../core/services/premio.service';
import { Premio } from '../../../core/models/premio.model';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './navigation-bar.component.html',
  styleUrl: '/navigation-bar.component.css'
})
export class NavigationBarComponent implements OnInit {

  // Signal Input moderno para el usuario
  user = input<User | null>(null);
  
  error = output<string>();

  regions: Region[] = Regions.getValues();

  // Convertimos el Observable del servicio en un Signal directamente
  awards = signal<Premio[]>([]);

  constructor(
    private router: Router,
    private loginService: LoginService,
    private authService: AuthService,
    private premioService: PremioService
  ) {}

  ngOnInit(): void {
    this.premioService.getPremios().subscribe({
      next: (premios) => this.awards.set(premios),
      error: (error) => {
        this.error.emit(error?.error?.message ?? 'Error recuperando los premios');
        this.awards.set([]);  
      }
    }); 
  }

  logout() {
    this.loginService.logout().subscribe({
      next: () => {
          this.authService.logout();
          this.router.navigate(['/app']);
      },
      error: () => this.error.emit('Error al abandonar la sesión')
    });
  }
}
