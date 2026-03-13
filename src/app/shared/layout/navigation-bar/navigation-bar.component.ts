import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

import { catchError, Observable, of } from 'rxjs';

import { LoginService } from '../../../core/services/login.service';
import { User } from '../../../core/models/user.model';
import { Region, Regions } from '../../../core/enum/regions';
import { PremioService } from '../../../core/services/premio.service';
import { Premio } from '../../../core/models/premio.model';
@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule

  ],
  templateUrl: './navigation-bar.component.html'
})
export class NavigationBarComponent implements OnInit {

  @Input() user!: User;
  @Output() error = new EventEmitter<string>();

  regions: Region[] = Regions.getValues();
  awards$!: Observable<Premio[]>;


  constructor(
    private router: Router,
    private loginService: LoginService,
    private premioService: PremioService
  ) {}

  ngOnInit(): void {
    this.awards$ = this.premioService.getPremios()
                          .pipe(
                            catchError(error => {
                                this.error.emit(error?.error?.message ?? 'Error recuperando los premios');
                                return of([]);
                          })
                        );
  }

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
