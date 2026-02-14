import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  username = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.errorMessage = '';
    if (!this.username?.trim()) {
      this.errorMessage = 'Username is required.';
      return;
    }
    if (!this.password) {
      this.errorMessage = 'Password is required.';
      return;
    }
    this.loading = true;
    this.authService.login(this.username.trim(), this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message ?? err?.message;
        if (err?.status === 0) {
          this.errorMessage = 'Cannot reach server. Make sure the backend is running (e.g. port 8585).';
        } else {
          this.errorMessage = msg || 'Login failed. Please check your credentials.';
        }
      }
    });
  }
}
