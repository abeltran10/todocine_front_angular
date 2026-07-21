import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicListasComponent } from './publicas/lista-publica.component';
import { UserListasComponent } from './usuario/lista-usuario.component';
import { HeaderComponent } from '../../../shared/layout/header/header.component';
import { NotificationService } from '../../../core/services/notification.service';


@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    PublicListasComponent,
    UserListasComponent,
    HeaderComponent
  ],
  templateUrl: './lista.component.html'
})
export class ListaComponent {
 
  publica = signal<boolean>(true);
  title = signal<string>('LISTAS PÚBLICAS');

  constructor(private notificationService: NotificationService) {}

  setPublica() {
    // Usamos .update() para invertir el valor booleano actual del signal
    this.publica.update(value => !value);
    this.updateTitle();
  }

  private updateTitle() {
    const esPublica = this.publica();
    
    this.title.set(esPublica ? 'LISTAS PÚBLICAS' : 'MIS LISTAS');
  }

  showError(msg: string) {
    this.notificationService.showError(msg);
  }

  showSuccess(msg: string) {
    this.notificationService.showSuccess(msg);
  }
}