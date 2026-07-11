// src/app/services/captcha.service.ts
import { Injectable } from '@angular/core';

declare var grecaptcha: any;

@Injectable({ providedIn: 'root' })
export class CaptchaService {
  private siteKey = '6Leus04tAAAAALxtQWGawf7ltGrQpZMCZ7EWGRe4';

  getToken(): Promise<string> {
    return new Promise((resolve) => {
      grecaptcha.ready(() => {
        grecaptcha.execute(this.siteKey, { action: 'register' }).then((token: string) => {
          resolve(token);
        });
      });
    });
  }
}