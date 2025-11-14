import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { UserResponse } from '../../model/User';
import { signal } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class Sidebar {
  private authService = inject(AuthService);
  private router = inject(Router);
  private userService = inject(UserService);

  // signal để lưu user name
  userName = signal<string>('');

  constructor() {
    // Khi currentUserId thay đổi hoặc có giá trị, gọi API lấy user info
    const userId = this.authService.currentUserId();
    if (userId) {
      this.fetchUserName(userId);
    }

    // // Nếu muốn reactive khi currentUserId thay đổi trong tương lai
    // this.authService.currentUserId.subscribe((id) => {
    //   if (id) {
    //     this.fetchUserName(id);
    //   } else {
    //     this.userName.set('');
    //   }
    // });
  }

  private fetchUserName(userId: string) {
    this.userService.getUserById(userId).subscribe({
      next: (user: UserResponse) => {
        this.userName.set(user.username); // hoặc user.fullName tuỳ model
      },
      error: (err) => {
        console.error('Lấy user info thất bại', err);
        this.userName.set('');
      },
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
