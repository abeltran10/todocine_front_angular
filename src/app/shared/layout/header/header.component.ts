import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <h1 class="text-info text-center">
      {{ title }}
    </h1>
  `
})
export class HeaderComponent {
  @Input() title = '';
}
