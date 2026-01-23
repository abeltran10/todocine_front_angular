import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Awards, Award, AwardKey } from '../../../core/enum/awards';

import { NavigationBarComponent } from '../../../shared/layout/navigation-bar/navigation-bar.component';
import { NotificationComponent } from '../../../shared/common/notification/notification.component';
import { HeaderComponent } from '../../../shared/layout/header/header.component';

@Component({
  selector: 'app-premio-anyos',
  standalone: true,
  imports: [
    CommonModule,
    NavigationBarComponent,
    NotificationComponent,
    HeaderComponent,
  ],
  templateUrl: './premio-anyos.component.html'
})
export class PremioAnyosComponent implements OnInit {

  award!: Award;
  title = '';
  rows: number[][] = [];

  constructor(private route: ActivatedRoute) {}

 ngOnInit() {
    this.route.paramMap.subscribe(params => {
        const id = Number(params.get('premioId')) as AwardKey;
        this.award = Awards.getAwards(id);
        this.title = this.award.award.toUpperCase();
        this.buildRows(this.award.anyos);
  });
}

  private buildRows(anyos: number[]): void {
    this.rows = [];

    for (let i = 0; i < anyos.length; i += 3) {
      this.rows.push(anyos.slice(i, i + 3));
    }
  }
}

