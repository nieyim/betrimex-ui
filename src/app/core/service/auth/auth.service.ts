import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthRequest, AuthResponse } from '../../model/User';
import { JwtHelperService } from './jwthelper.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/v1/auth';
  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';

  // Signal to save current user info
  currentUsername = signal<string | null>(null);
  currentUserId = signal<string | null>(null);
  loading = signal(false);
  loginError = signal('');

  // Contructor to initialize service
  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
    this.initializeAuth();
  }

  // Initialize authentication state from stored tokens
  private initializeAuth(): void {
    const token = this.getAccessToken();

    if (token && this.jwtHelper.isTokenValid(token)) {
      // Decode token
      const payload = this.jwtHelper.decodeToken(token);

      // Get username from token
      this.currentUsername.set(payload?.sub || null);
    } else {
      this.logout();
    }
  }

  login(request: AuthRequest): Observable<AuthResponse> {
    this.loading.set(true);
    this.loginError.set('');

    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request).pipe(
      tap({
        next: (res) => {
          this.setTokens(res.accessToken, res.refreshToken);

          // Lấy username từ token
          const payload = this.jwtHelper.decodeToken(res.accessToken);
          this.currentUsername.set(payload?.sub || null);

          // Lấy userId từ response (nếu backend trả về)
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
    this.currentUsername.set(null);
    this.currentUserId.set(null);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getAccessToken();
    return this.jwtHelper.isTokenValid(token);
  }

  getCurrentUsername(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;

    const payload = this.jwtHelper.decodeToken(token);
    return payload?.sub || null;
  }
}
