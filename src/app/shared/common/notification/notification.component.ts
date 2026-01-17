import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html'
})
export class NotificationComponent {

  @Input() successMessage = '';
  @Input() errorMessage = '';

  get show(): boolean {
    return !!this.successMessage || !!this.errorMessage;
  }

  get cssClass(): string {
    return this.successMessage ? 'bg-success' : 'bg-warning';
  }

  get message(): string {
    return this.successMessage || this.errorMessage;
  }
}
