import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicListasComponent } from './publicas/lista-publica.component';
import { UserListasComponent } from './usuario/lista-usuario.component';
import { NavigationBarComponent } from '../../shared/layout/navigation-bar/navigation-bar.component';
import { NotificationComponent } from '../../shared/common/notification/notification.component';
import { HeaderComponent } from '../../shared/layout/header/header.component';
import { User } from '../../core/models/user.model';
import { BehaviorSubject, timer } from 'rxjs';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    NavigationBarComponent, 
    NotificationComponent, 
    HeaderComponent,
    PublicListasComponent,
    UserListasComponent
  ],
  templateUrl: './lista.component.html'
})
export class ListaComponent implements OnInit {
  usuario!: User;
  publica: boolean = true;
  title: string = 'Listas Públicas';

  messageSuccessSubject = new BehaviorSubject<string>('');
  messageErrorSubject = new BehaviorSubject<string>('');
  successMessage$ = this.messageSuccessSubject.asObservable();
  errorMessage$ = this.messageErrorSubject.asObservable();

  constructor() {}

  ngOnInit(): void {
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
      this.usuario = JSON.parse(loggedUser);
    }
  }

  setPublica() {
    this.publica = !this.publica;
    this.updateTitle();
  }

  private updateTitle() {
    this.title = this.publica ? 'Listas Públicas' : 'Mis Listas';
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