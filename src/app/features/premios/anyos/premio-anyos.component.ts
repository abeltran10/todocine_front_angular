import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Awards, Award, AwardKey } from '../../../core/enum/awards';
import { User } from '../../../core/models/user.model';

import { NavigationBarComponent } from '../../../shared/layout/navigation-bar/navigation-bar.component';
import { HeaderComponent } from '../../../shared/layout/header/header.component';
import { AnyosComponent } from './anyos.component';

@Component({
  selector: 'app-premio-anyos',
  standalone: true,
  imports: [
    CommonModule,
    NavigationBarComponent,
    HeaderComponent,
    AnyosComponent
  ],
  templateUrl: './premio-anyos.component.html'
})
export class PremioAnyosComponent implements OnInit {

  usuario!: User;

  errorMessage = ''

  award!: Award;
  title = '';
  rows: number[][] = [];

  constructor(private route: ActivatedRoute) {}

 ngOnInit() {
    // Usuario logueado
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
      this.usuario = JSON.parse(loggedUser);
    }

    this.route.paramMap.subscribe(params => {
        const id = Number(params.get('premioId'));

        if (!id) return; 

        const award = Awards.getAward(id as AwardKey);

        if (!award) return; 

        this.award = award;
        this.title = award.award.toUpperCase();
        this.buildRows(award.anyos);
});

}

  private buildRows(anyos: number[]): void {
    this.rows = [];

    for (let i = 0; i < anyos.length; i += 3) {
      this.rows.push(anyos.slice(i, i + 3));
    }
  }
}

