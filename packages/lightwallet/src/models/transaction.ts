export enum TransactionAction {
  RECEIVED = 'received',
  SENT = 'sent',
  RECEIVING = 'receiving',
  SENDING = 'sending',
  UNLOCK = 'unlock',
  INVITE = 'invite'
}

export enum UnlockRequestStatus {
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  PENDING = 'pending'
}

export interface ITransactionIO {
  amount: number;
  address: string;
  index: number;
}

export interface ITransaction {
  txid: string;
  name: string;
  action: TransactionAction;
  amount: number;
  amountStr: string;
  alternativeAmountStr: string;
  status: UnlockRequestStatus;
  fees: number;
  time: number;
  confirmations: number;
  outputs: ITransactionIO[];
  inputs: ITransactionIO[];
  lowFees: boolean;
  alias: string;
  parentAddress: string;
  isCoinbase: boolean;
}
