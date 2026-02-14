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
  private baseUrl = `${API_BASE_URL}/accounts`;

  constructor(private http: HttpClient) {}

  getAccount(id: number): Observable<AccountResponse> {
    return this.http.get<AccountResponse>(`${this.baseUrl}/${id}`);
  }

  getBalance(id: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${id}/balance`);
  }

  getTransactions(id: number): Observable<TransactionLog[]> {
    return this.http.get<TransactionLog[]>(`${this.baseUrl}/${id}/transactions`);
  }
}
