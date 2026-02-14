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
    const accountId = this.authService.getAccountId();
    if (accountId == null) {
      this.loading = false;
      this.errorMessage = 'Account not found.';
      return;
    }
    this.accountService.getTransactions(accountId).subscribe({
      next: (list) => {
        const currentId = accountId;
        this.rows = (list || []).map((t) => {
          const isDebit = (t as { fromAccountId?: number }).fromAccountId === currentId
            || (t as { fromAccountID?: number }).fromAccountID === currentId;
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
      error: () => {
        this.errorMessage = 'Failed to load transactions.';
        this.loading = false;
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
