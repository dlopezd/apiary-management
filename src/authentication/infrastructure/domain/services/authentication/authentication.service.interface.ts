import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root',
})
export abstract class AuthenticationService {
  public abstract signIn(email: string, password: string): Observable<User>;
  public abstract signOut(): Observable<void>;
  public abstract getCurrentUser(): User | null;

  public readonly user = signal<User | null>(null);
  public readonly isAuthenticated = signal(false);
}
