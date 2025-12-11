import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../shared/components/header/header';
import { Barchart } from './charts/barchart/barchart';
import { CardLayout, DashboardStatsCardRespones } from '../../core/model/Dashboard';
import { DashboardService } from '../../core/service/dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, Header, Barchart],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  now = new Date();

  // Loading state for skeleton UI
  isLoading = signal(true);

  // Raw response from API
  dashboardStatCards: DashboardStatsCardRespones = new DashboardStatsCardRespones();

  // Data mapped to UI cards
  stats: CardLayout[] = [];

  constructor(private dashboardService: DashboardService) {
    // Auto update clock every second
    setInterval(() => (this.now = new Date()), 1000);
  }

  ngOnInit(): void {
    this.fetchDashboardStats();
  }

  /** Fetch dashboard stats from API */
  fetchDashboardStats() {
    this.isLoading.set(true);

    this.dashboardService.getDashboardStats().subscribe({
      next: (response: DashboardStatsCardRespones) => {
        this.dashboardStatCards = response;
        this.buildStats(); // Convert response → UI layout
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Dashboard API error:', err);
        this.isLoading.set(false);
      },
    });
  }

  /** Build card layout to display in UI */
  buildStats() {
    this.stats = [
      {
        label: 'Tổng Lô Hôm nay',
        value: this.dashboardStatCards.totalProductToday,
        icon: 'assets/icons/sprite.svg#icon-truck',
        bgClass: 'bg-blue-400',
        iconBg: 'bg-blue-50',
        iconColor: 'stroke-blue-500',
        trend: 12,
      },
      {
        label: 'Tổng số lượng Dừa',
        value: this.dashboardStatCards.totalProductQuantity,
        icon: 'assets/icons/sprite.svg#icon-cube',
        bgClass: 'bg-lime-400',
        iconBg: 'bg-lime-50',
        iconColor: 'stroke-lime-500',
        trend: 8,
      },
      {
        label: 'Tổng số phiếu gửi',
        value: this.dashboardStatCards.totalQRScan,
        icon: 'assets/icons/sprite.svg#icon-document',
        bgClass: 'bg-yellow-400',
        iconBg: 'bg-yellow-50',
        iconColor: 'stroke-yellow-500',
        trend: 6,
      },
      {
        label: 'Lỗi phát hiện',
        value: this.dashboardStatCards.totalUser,
        icon: 'assets/icons/sprite.svg#icon-exclamation',
        bgClass: 'bg-red-400',
        iconBg: 'bg-red-50',
        iconColor: 'stroke-red-500',
        trend: null,
      },
    ];
  }


  /** Dummy line chart data (kept from your version) */
  get uptimeDots() {
    return [
      { x: 0, y: 40 },
      { x: 25, y: 30 },
      { x: 50, y: 45 },
      { x: 75, y: 15 },
      { x: 100, y: 35 },
    ];
  }

  /** SVG Bezier line for small uptime chart */
  get uptimePathLine() {
    return 'M0,40 C12.5,40 12.5,30 25,30 S37.5,45 50,45 S62.5,15 75,15 S87.5,35 100,35';
  }

  get uptimePathArea() {
    return this.uptimePathLine + ' L100,50 L0,50 Z';
  }
}
