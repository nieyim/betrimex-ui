export class DashboardStatsCardRespones {
  totalProductToday: number = 0;
  totalProductQuantity: number = 0;
  totalQRScan: number = 0;
  totalUser: number = 0;
}

export interface CardLayout {
  label?: string;
  value?: number;
  icon?: string;
  bgClass?: string;
  iconBg?: string;
  iconColor?: string;
  trend?: number | null;
}