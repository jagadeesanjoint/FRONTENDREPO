import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Transfer } from './Transfer/transfer';
import { History } from './History/history';
import { Login } from './login/login';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'transfer', component: Transfer, canActivate: [authGuard] },
  { path: 'history', component: History, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
