import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountResponse } from '../models/account-response.model';
import { TransactionLog } from '../models/transaction-log.model';
import { API_BASE_URL } from '../core/api.config';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  /** Current user's account (uses Basic auth, no id in URL). Use for dashboard. */
  getCurrentAccount(): Observable<AccountResponse> {
    return this.http.get<AccountResponse>(`${this.baseUrl}/me`);
  }

  /** Current user's transactions (uses Basic auth). Use for history. */
  getCurrentTransactions(): Observable<TransactionLog[]> {
    return this.http.get<TransactionLog[]>(`${this.baseUrl}/me/transactions`);
  }

  /** Legacy: get account by id (e.g. for transfer form source). Prefer getCurrentAccount() for dashboard. */
  getAccount(id: number): Observable<AccountResponse> {
    return this.http.get<AccountResponse>(`${this.baseUrl}/accounts/${id}`);
  }

  getBalance(id: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/accounts/${id}/balance`);
  }

  getTransactions(id: number): Observable<TransactionLog[]> {
    return this.http.get<TransactionLog[]>(`${this.baseUrl}/accounts/${id}/transactions`);
  }
}
