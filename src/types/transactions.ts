export interface TxHistory {
  title: string;
  txHash: string;
  type: TransactionType;
  symbol: string;
  amount: number;
  amountUsd: number;
  timestamp: number;
}

export interface ITransactionHistory {
  transactions: TxHistory[];
  total: number;
  page: number;
}

export enum TransactionType {
  Receive = 'Receive',
  Sent = 'Sent',
  Swap = 'Swap',
  Stake = 'Stake',
  Unstake = 'Unstake',
  Lock = 'Lock',
  Unlock = 'Unlock ',
  Vote = 'Vote',
  Unknown = 'Unknown',
}
