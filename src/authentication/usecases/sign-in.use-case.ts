import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AUTHENTICATION_SERVICE } from '../infrastructure/framework/auth.token';
import { User } from '../infrastructure/domain/services/authentication/models/user.model';

export class SignInUseCase {
  private readonly authRepository = inject(AUTHENTICATION_SERVICE);
  private readonly router = inject(Router);

  async execute(email: string, password: string): Promise<User> {
    const user = await this.authRepository.signIn(email, password);
    await this.router.navigate(['/dashboard']);
    return user;
  }
}
