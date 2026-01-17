import { Injectable } from '@angular/core';
import { UserService } from './user.service';

import {User} from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private userService: UserService) {}

  async isTokenValid(): Promise<boolean> {
    const loggedUser = localStorage.getItem('loggedUser');
    if (!loggedUser) return false;

    const user: User = JSON.parse(loggedUser);
    try {
      const response: User = await this.userService.getUser(user.id);
      localStorage.setItem('loggedUser', JSON.stringify(response));
      return true;
    } catch (error) {
      localStorage.removeItem('loggedUserToken');
      localStorage.removeItem('loggedUser');
      return false;
    }
  }

}
