import { Injectable, signal } from "@angular/core";


@Injectable({ providedIn: 'root' })
export class NotificationService {
  // Signals para los mensajes
  private successSignal = signal<string>('');
  private errorSignal = signal<string>('');

  // Los exponemos como de solo lectura
  readonly success = this.successSignal.asReadonly();
  readonly errorMessage = this.errorSignal.asReadonly();

  showSuccess(msg: string) {
    this.successSignal.set(msg);
    setTimeout(() => this.successSignal.set(''), 5000);
  }

  showError(msg: string) {
    this.errorSignal.set(msg);
    setTimeout(() => this.errorSignal.set(''), 5000);
  }
}