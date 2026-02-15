import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountService } from '../services/account';
import { AuthService } from '../services/auth';
import { AccountResponse } from '../models/account-response.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  account: AccountResponse | null = null;
  balance = 0;
  holderName = '';
  currency = 'USD';
  currencySymbol = '$';
  loading = true;
  errorMessage = '';

  constructor(
    private accountService: AccountService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.holderName = this.authService.getHolderName();
    this.loading = true;
    this.errorMessage = '';
    const accountId = this.authService.getAccountId();

    // Try GET /me first; if it fails (e.g. backend not sending auth), fall back to GET /accounts/{id} with stored accountId from login
    this.accountService.getCurrentAccount().subscribe({
      next: (res) => {
        this.account = res;
        this.balance = res.balance;
        this.holderName = res.holderName || this.holderName;
        this.loading = false;
      },
      error: (err) => {
        if (err?.status === 401) {
          this.authService.logout();
          return;
        }
        if (accountId != null) {
          this.accountService.getAccount(accountId).subscribe({
            next: (res) => {
              this.account = res;
              this.balance = res.balance;
              this.holderName = res.holderName || this.holderName;
              this.loading = false;
            },
            error: (e) => {
              this.loading = false;
              this.setError(e);
            }
          });
        } else {
          this.loading = false;
          this.setError(err);
        }
      }
    });
  }

  private setError(err: { status?: number; error?: { message?: string }; message?: string }): void {
    if (err?.status === 0) {
      this.errorMessage = 'Cannot reach server. Make sure the backend is running (port 8585).';
    } else {
      this.errorMessage = err?.error?.message ?? err?.message ?? 'Failed to load account.';
    }
  }

  /** Time-based greeting: Good Morning / Afternoon / Evening */
  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning,';
    if (hour < 17) return 'Good Afternoon,';
    return 'Good Evening,';
  }

  /** Masked account number: XXXX-XXXX-1234 (last 4 digits of account id) */
  get maskedAccountNumber(): string {
    const id = this.account?.id ?? this.authService.getAccountId();
    if (id == null) return 'XXXX-XXXX-XXXX';
    const last4 = String(id).padStart(4, '0').slice(-4);
    return `XXXX-XXXX-${last4}`;
  }

  logout(): void {
    this.authService.logout();
  }
}
