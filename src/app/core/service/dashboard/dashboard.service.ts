import { DashboardStatsCardRespones } from '../../model/Dashboard';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private httpClient: HttpClient) {}
  private readonly baseUrl = 'http://localhost:8080/api/v1/dashboard';

  getDashboardStats(): Observable<DashboardStatsCardRespones> {
    return this.httpClient.get<DashboardStatsCardRespones>(`${this.baseUrl}/get-dashboard-stats`);
  }
}
