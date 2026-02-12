import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransferRequest } from '../models/transfer-request.model';
import { TransferResponse } from '../models/transfer-response.model';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  private baseUrl: string = 'http://localhost:8585/api/v';

  constructor(private http: HttpClient) {}

  transfer(request: TransferRequest): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(`${this.baseUrl}/transfer`, request);
  }
}
