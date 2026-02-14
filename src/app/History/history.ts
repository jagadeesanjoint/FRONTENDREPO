import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountService } from '../services/account';
import { AuthService } from '../services/auth';
import { TransactionLog } from '../models/transaction-log.model';

export type TransactionType = 'DEBIT' | 'CREDIT';

export interface HistoryRow {
  date: string;
  type: TransactionType;
  amount: number;
  status: string;
  raw: TransactionLog;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './history.html',
  styleUrl: './history.css'
})
export class History implements OnInit {
  rows: HistoryRow[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private accountService: AccountService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentId = this.authService.getAccountId();
    this.loading = true;
    this.errorMessage = '';
    this.accountService.getCurrentTransactions().subscribe({
      next: (list) => {
        this.rows = (list || []).map((t) => {
          const fromId = (t as { fromAccountId?: number }).fromAccountId ?? (t as { fromAccountID?: number }).fromAccountID;
          const isDebit = fromId === currentId;
          const dateStr = (t as { createdOn?: string }).createdOn
            || (t as { timestamp?: string }).timestamp
            || (t as { createdOn?: string })['createdOn']
            || '';
          return {
            date: this.formatDate(dateStr),
            type: isDebit ? 'DEBIT' : 'CREDIT',
            amount: t.amount,
            status: t.status || 'UNKNOWN',
            raw: t
          };
        });
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err?.status === 401) {
          this.authService.logout();
          return;
        }
        this.errorMessage = err?.status === 0
          ? 'Cannot reach server. Make sure the backend is running (port 8585).'
          : 'Failed to load transactions.';
      }
    });
  }

  formatDate(value: string): string {
    if (!value) return '—';
    const d = new Date(value);
    return isNaN(d.getTime()) ? value : d.toLocaleString(undefined, {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  }

  back(): void {
    window.history.back();
  }
}
