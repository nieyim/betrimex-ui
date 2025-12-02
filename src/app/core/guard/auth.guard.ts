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

    // Deny access if no token found
    if (!token) {
      this.redirectToLogin();
      return false;
    }

    // Deny access if token is invalid or expired
    if (!this.jwtHelper.isTokenValid(token)) {
      this.redirectToLogin();
      return false;
    }
    return true;
  }

  // Method to handle redirection to login
  private redirectToLogin() {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/']);
  }
}
