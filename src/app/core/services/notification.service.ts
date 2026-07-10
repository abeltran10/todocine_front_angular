import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private successSubject = new BehaviorSubject<string>('');
  private errorSubject = new BehaviorSubject<string>('');
  
  success$ = this.successSubject.asObservable();
  errorMessage$ = this.errorSubject.asObservable();

  showSuccess(msg: string) {
    this.successSubject.next(msg);
    setTimeout(() => this.successSubject.next(''), 5000);
  }

  showError(msg: string) {
    this.errorSubject.next(msg);
    setTimeout(() => this.errorSubject.next(''), 5000);
  }
}