import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicListasComponent } from './publicas/lista-publica.component';
import { UserListasComponent } from './usuario/lista-usuario.component';
import { HeaderService } from '../../../core/services/header.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    PublicListasComponent,
    UserListasComponent
  ],
  templateUrl: './lista.component.html'
})
export class ListaComponent implements OnInit {
 
  publica: boolean = true;
  title: string = 'LISTAS PÚBLICAS';

  constructor(private headerService: HeaderService,
              private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle(this.title);
  
  }

  setPublica() {
   this.publica = !this.publica;
   this.updateTitle();
  }

  private updateTitle() {
    this.headerService.setTitle(this.publica ? 'LISTAS PÚBLICAS' : 'MIS LISTAS');
  }

}