import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../services/account';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.html',
  styleUrls: ['./history.css']
})
export class History implements OnInit {

  id: number = 1;
  transactions: any[] = [];

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.getTransactions(this.id)
      .subscribe(res => {
        this.transactions = res;
      });
  }
}
