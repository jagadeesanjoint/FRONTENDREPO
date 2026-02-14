/** Matches backend TransactionLog returned from POST /api/v1/transfers */
export interface TransferResponse {
  id?: string;
  transactionId?: string;  // alias for id
  status: string;
  message?: string;
  fromAccountID?: number;
  toAccountID?: number;
  debitedFrom?: number;
  creditedTo?: number;
  amount?: number;
  createdOn?: string;
}
