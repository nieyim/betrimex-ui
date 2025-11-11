import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject, signal } from '@angular/core';
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

  loading = signal(false);
  loginError = signal('');

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.loginError.set('');

      const request: AuthRequest = this.loginForm.value as AuthRequest;
      this.authService.login(request).subscribe({
        next: (res) => {
          console.log('✅ Login success:', res);

          // Lưu token vào localStorage
          localStorage.setItem('accessToken', res.accessToken);
          localStorage.setItem('refreshToken', res.refreshToken);

          this.router.navigate(['/dashboard']);
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          this.loginError.set('Sai tên tài khoản hoặc mật khẩu! Xin vui lòng thử lại.');
        },
      });
    }
  }
}
