import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicListasComponent } from './publicas/lista-publica.component';
import { UserListasComponent } from './usuario/lista-usuario.component';
import { HeaderComponent } from '../../../shared/layout/header/header.component';


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
 
  publica: boolean = true;
  title: string = 'LISTAS PÚBLICAS';

  constructor() {}


  setPublica() {
   this.publica = !this.publica;
   this.updateTitle();
  }

  private updateTitle() {
    this.title = this.publica ? 'LISTAS PÚBLICAS' : 'MIS LISTAS';
  }

}