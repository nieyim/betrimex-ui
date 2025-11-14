import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { AuthRequest } from '../../model/User';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  // Không cần signal riêng trong component nữa
  loading = this.authService.loading;
  loginError = this.authService.loginError;

  onSubmit() {
    if (this.loginForm.valid) {
      const request: AuthRequest = this.loginForm.value as AuthRequest;

      // Gọi service login, state loading/error đã có trong service
      this.authService.login(request).subscribe({
        next: (res) => {
          console.log('✅ Login success:', res);
          // Navigate sau khi login thành công
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.log('Login failed', err);
        },
      });
    }
  }
}
