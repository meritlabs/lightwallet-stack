export enum TransactionAction {
  RECEIVED = 'received',
  SENT = 'sent',
  UNLOCK = 'unlock',
  INVITE = 'invite',
  MOVED = 'moved',
  MINING_REWARD = 'mining_reward',
  AMBASSADOR_REWARD = 'ambassador_reward'
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
  alias: string;
  isMine: boolean;
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
  isInvite: boolean;
}

export interface IDisplayTransaction extends ITransaction {
  actionStr: string;
  walletId: string;
  isPendingEasySend: boolean;
  addressFrom: string;
  addressTo: string;
  type: 'credit' | 'debit';
}
