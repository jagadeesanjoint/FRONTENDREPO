import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../services/account';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  id: number = 1;
  account: any;
  balance: number = 0;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.getAccount(this.id)
      .subscribe(res => {
        this.account = res;
        this.balance = res.balance;
      });
  }
}
