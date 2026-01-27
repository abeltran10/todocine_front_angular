import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-anyos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './anyos.component.html'
})
export class AnyosComponent {

  @Input() premioCod!: number;
  @Input() premioAnyo!: number;

  constructor(private router: Router) {}

  handleLoadPremio(): void {
    this.router.navigate([
      '/app/premio',
      this.premioCod,
      'anyo',
      this.premioAnyo
    ]);
  }
}
