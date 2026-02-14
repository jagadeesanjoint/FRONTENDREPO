export interface TransferRequest {
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  /** Optional; backend generates a unique idempotency key automatically if omitted */
  idempotencyKey?: string;
}
