import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '../service/jwthelper.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private jwtHelper: JwtHelperService) {}

  canActivate(): boolean {
    const token = localStorage.getItem('accessToken');

    // Không có token → không cho truy cập
    if (!token) {
      this.redirectToLogin();
      return false;
    }

    // Token không hợp lệ hoặc hết hạn
    if (!this.jwtHelper.isTokenValid(token)) {
      this.redirectToLogin();
      return false;
    }

    // Token OK → cho vào
    return true;
  }

  private redirectToLogin() {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/']);
  }
}
