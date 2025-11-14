import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { AuthRequest, AuthResponse } from '../model/User';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/v1/auth';
  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';

  // Signal cho state toàn app
  currentUserId = signal<string | null>(null);
  loading = signal(false);
  loginError = signal('');

  constructor(private http: HttpClient) {
    const token = this.getAccessToken();
  }

  login(request: AuthRequest): Observable<AuthResponse> {
    this.loading.set(true);
    this.loginError.set('');

    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request).pipe(
      tap({
        next: (res) => {
          this.setTokens(res.accessToken, res.refreshToken);
          // Giả sử userId có trong payload, ví dụ decode từ JWT
          this.currentUserId.set(res.id || null);
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          this.loginError.set('Sai tên tài khoản hoặc mật khẩu! Xin vui lòng thử lại.');
        },
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.currentUserId.set(null);
  }

  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }
}
