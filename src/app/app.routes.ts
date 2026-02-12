import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Transfer } from './Transfer/transfer';
import { History } from './History/history';
import { Login } from './login/login';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'transfer', component: Transfer },
  { path: 'history', component: History },
];
