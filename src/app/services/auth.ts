import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';

const TOKEN_KEY = 'mts_token';
const ACCOUNT_ID_KEY = 'mts_accountId';
const HOLDER_NAME_KEY = 'mts_holderName';

export interface LoginResponse {
  accountId: number;
  holderName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private get storage(): Storage | null {
    return isPlatformBrowser(this.platformId) ? sessionStorage : null;
  }

  /**
   * Login with username and password. Only credentials present in the backend username table can log in.
   * Returns accountId and holderName so dashboard and history show data for that account.
   */
  login(username: string, password: string): Observable<LoginResponse> {
    const token = btoa(`${username}:${password}`);
    return this.http.post<LoginResponse>(`${API_BASE_URL}/auth/login`, { username, password }).pipe(
      tap((res) => {
        this.setToken(token);
        this.setAccountId(res.accountId);
        this.setHolderName(res.holderName ?? '');
      })
    );
  }

  logout(): void {
    this.storage?.removeItem(TOKEN_KEY);
    this.storage?.removeItem(ACCOUNT_ID_KEY);
    this.storage?.removeItem(HOLDER_NAME_KEY);
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return this.storage?.getItem(TOKEN_KEY) ?? null;
  }

  getAccountId(): number | null {
    const id = this.storage?.getItem(ACCOUNT_ID_KEY);
    return id != null ? Number(id) : null;
  }

  getHolderName(): string {
    return this.storage?.getItem(HOLDER_NAME_KEY) ?? '';
  }

  private setToken(token: string): void {
    this.storage?.setItem(TOKEN_KEY, token);
  }

  private setAccountId(id: number): void {
    this.storage?.setItem(ACCOUNT_ID_KEY, String(id));
  }

  private setHolderName(name: string): void {
    this.storage?.setItem(HOLDER_NAME_KEY, name);
  }
}
