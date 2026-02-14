import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TransferService } from '../services/transfer';
import { AuthService } from '../services/auth';
import { TransferResponse } from '../models/transfer-response.model';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './transfer.html',
  styleUrl: './transfer.css'
})
export class Transfer {
  fromAccountId: number | null = null;
  toAccountId: number | null = null;
  amount: number | null = null;
  response: TransferResponse | null = null;
  errorMessage = '';
  loading = false;

  constructor(
    private transferService: TransferService,
    private authService: AuthService,
    private router: Router
  ) {
    this.fromAccountId = this.authService.getAccountId();
  }

  transfer(): void {
    this.errorMessage = '';
    this.response = null;
    const from = this.fromAccountId ?? 0;
    const to = this.toAccountId ?? 0;
    const amt = this.amount ?? 0;
    if (to <= 0) {
      this.errorMessage = 'Please enter a valid destination account.';
      return;
    }
    if (amt <= 0) {
      this.errorMessage = 'Amount must be greater than 0.';
      return;
    }
    if (from === to) {
      this.errorMessage = 'From and To accounts must be different.';
      return;
    }
    this.loading = true;
    this.transferService.transfer({
      fromAccountId: from,
      toAccountId: to,
      amount: amt
    }).subscribe({
      next: (res) => {
        this.response = {
          ...res,
          transactionId: res.id ?? (res as { transactionId?: string }).transactionId,
          message: res.status === 'SUCCESS'
            ? `Transfer of ${res.amount ?? ''} completed. Balance and History are updated.`
            : (res.message ?? String(res.status))
        };
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message ?? err?.message ?? 'Transfer failed.';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
