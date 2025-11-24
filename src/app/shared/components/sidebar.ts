import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { signal } from '@angular/core';
import { AuthService } from '../../core/service/auth.service';
import { UserService } from '../../core/service/user.service';
import { UserResponse } from '../../core/model/User';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class Sidebar {
  private authService = inject(AuthService);
  private router = inject(Router);

  // signal để lưu user name
  userName = signal<string>('');
  loading = signal<boolean>(false);
  isCollapsed = signal<boolean>(false);
  private mobileBreakpoint = 768;

  constructor() {
    const username = this.authService.currentUsername();
    if (username) {
      this.userName.set(username);
    }
  }

  ngOnInit(): void {
    this.checkScreenSize();
  }

  // Lắng nghe sự kiện resize của trình duyệt
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  // Logic kiểm tra và set signal
  private checkScreenSize() {
    if (window.innerWidth < this.mobileBreakpoint) {
      this.isCollapsed.set(true);
    } else {
      this.isCollapsed.set(false);
    }
  }

  // private fetchUserDetails(userId: string): void {
  //   this.loading.set(true);

  //   this.userService.getUserById(userId).subscribe({
  //     next: (user: UserResponse) => {
  //       this.loading.set(false);
  //     },
  //     error: (err) => {
  //       console.error('Không thể lấy thông tin user:', err);
  //       this.loading.set(false);
  //     },
  //   });
  // }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

   toggleSidebar(): void {
    this.isCollapsed.set(!this.isCollapsed());
  }
}
