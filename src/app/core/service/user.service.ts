import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserResponse } from '../model/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/v1/users';

  constructor(private http: HttpClient) {}

  // Lấy danh sách tất cả người dùng
  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.baseUrl);
  }

  getUserById(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.baseUrl}/${id}`);
  }

  //   // Tạo người dùng mới
  //   createUser(request: UserRequest): Observable<UserResponse> {
  //     return this.http.post<UserResponse>(this.baseUrl, request);
  //   }

  //   // Cập nhật người dùng theo ID
  //   updateUser(id: string, request: UserRequest): Observable<UserResponse> {
  //     return this.http.put<UserResponse>(`${this.baseUrl}/${id}`, request);
  //   }

  //   // Xóa người dùng theo ID
  //   deleteUser(id: string): Observable<void> {
  //     return this.http.delete<void>(`${this.baseUrl}/${id}`);
  //   }
}
