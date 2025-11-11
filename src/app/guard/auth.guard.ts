import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      // Có token, cho phép truy cập
      return true;
    } else {
      // Không có token, chuyển về login
      this.router.navigate(['/']);
      return false;
    }
  }
}
