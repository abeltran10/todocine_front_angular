import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html'
})
export class NotificationComponent {

  // Signal Inputs modernos
  successMessage = input<string>('');
  errorMessage = input<string>('');

  // Propiedades reactivas calculadas automáticamente
  show = computed(() => !!this.successMessage() || !!this.errorMessage());

  cssClass = computed(() => 
    this.successMessage() ? 'text-white bg-success' : 'text-dark bg-warning'
  );

  message = computed(() => 
    this.successMessage() || this.errorMessage()
  );
}
