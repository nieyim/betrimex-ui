import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { AuthGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: '', component: Login }, // Trang chủ
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: '', redirectTo: '', pathMatch: 'full' },
];
