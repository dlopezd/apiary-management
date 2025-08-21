import { Injectable, signal } from '@angular/core';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root',
})
export abstract class AuthenticationServiceBase {
  public readonly user = signal<User | null>(null);
  public readonly isAuthenticated = signal(false);
}
