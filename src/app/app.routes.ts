import { Routes } from '@angular/router';
import { Login } from './modules/auth/login/login';
import { Dashboard } from './modules/dashboard/dashboard';
import { AuthGuard } from './core/guard/auth.guard';
import { Layout } from './modules/layout/layout';
import { CoconutCounter } from './modules/coconutcounter/coconutcounter';

export const routes: Routes = [
  { path: '', component: Login },

  {
    path: '',
    component: Layout,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'coconutcounter', component: CoconutCounter },
    ],
  },

  { path: '**', redirectTo: '' },
];
