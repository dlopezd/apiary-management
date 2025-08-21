import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignInUseCase } from '../../usecases/sign-in.use-case';
import { AUTHENTICATION_SERVICE } from '../../infrastructure/framework/auth.token';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private signInUseCase = inject(SignInUseCase);
  private authService = inject(AUTHENTICATION_SERVICE);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.router.navigate(['/']);
      }
    });
  }

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  isLoading = false;
  error: string | null = null;

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = null;

      try {
        const { email, password } = this.loginForm.getRawValue();
        await this.signInUseCase.execute(email, password);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Ha ocurrido un error';
      } finally {
        this.isLoading = false;
      }
    }
  }
}
