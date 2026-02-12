export interface TransactionLog {
  id: string;
  fromAccountID: number;
  toAccountID: number;
  amount: number;
  status: string;
  timestamp: string;
}
