import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  UserCredential,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { catchError, from, map, Observable, tap, throwError } from 'rxjs';
import { AuthenticationServiceBase } from './authentication.service.base';
import { AuthenticationService } from './authentication.service.interface';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthenticationService
  extends AuthenticationServiceBase
  implements AuthenticationService
{
  private auth = inject(Auth);
  private router = inject(Router);

  constructor() {
    super();
    // Subscribe to auth state changes
    authState(this.auth).subscribe((firebaseUser) => {
      if (firebaseUser) {
        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          emailVerified: firebaseUser.emailVerified,
        };
        this.user.set(user);
        this.isAuthenticated.set(true);
      } else {
        this.user.set(null);
        this.isAuthenticated.set(false);
      }
    });
  }

  signIn(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map((result) => ({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        emailVerified: result.user.emailVerified,
      })),
      tap(() => this.router.navigate(['/dashboard'])),
      catchError((error) => throwError(() => this.handleError(error))),
    );
  }

  loginWithGoogle(): Observable<UserCredential> {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider()));
  }

  signOut(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      tap(() => this.router.navigate(['/auth/login'])),
      catchError((error) => throwError(() => this.handleError(error))),
    );
  }

  getCurrentUser(): User | null {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return null;

    return {
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: currentUser.displayName,
      emailVerified: currentUser.emailVerified,
    };
  }

  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      // Handle specific Firebase Auth errors here
      switch (error.message) {
        case 'auth/invalid-email':
          return new Error('Correo electrónico inválido');
        case 'auth/user-disabled':
          return new Error('Esta cuenta ha sido deshabilitada');
        case 'auth/user-not-found':
          return new Error('Usuario no encontrado');
        case 'auth/wrong-password':
          return new Error('Contraseña incorrecta');
        default:
          return new Error('Ha ocurrido un error en la autenticación');
      }
    }
    return new Error('Ha ocurrido un error desconocido');
  }
}
