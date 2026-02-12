import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TransferService } from '../services/transfer';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './transfer.html',
  styleUrls: ['./transfer.css']
})
export class Transfer {

  fromAccountId: number = 0;
  toAccountId: number = 0;
  amount: number = 0;
  idempotencyKey: string = '';

  response: any;

  constructor(private transferService: TransferService) {}

  transfer(): void {
    const request = {
      fromAccountId: this.fromAccountId,
      toAccountId: this.toAccountId,
      amount: this.amount,
      idempotencyKey: this.idempotencyKey
    };

    this.transferService.transfer(request)
      .subscribe(res => {
        this.response = res;
      });
  }
}
