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
  loading = true;
  errorMessage = '';

  constructor(
    private accountService: AccountService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.holderName = this.authService.getHolderName();
    const accountId = this.authService.getAccountId();
    if (accountId == null) {
      this.loading = false;
      this.errorMessage = 'Account not found. Please log in again.';
      return;
    }
    this.accountService.getAccount(accountId).subscribe({
      next: (res) => {
        this.account = res;
        this.balance = res.balance;
        this.holderName = res.holderName || this.holderName;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load account.';
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
