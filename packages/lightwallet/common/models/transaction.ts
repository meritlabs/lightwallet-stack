import { EasySend } from '@merit/common/models/easy-send';
import { MeritContact } from './merit-contact';
import { DisplayWallet } from './display-wallet';
import { MeritWalletClient } from '@merit/common/merit-wallet-client/index';

export enum TransactionAction {
  RECEIVED = 'received',
  SENT = 'sent',
  UNLOCK = 'unlock',
  INVITE = 'invite',
  MOVED = 'moved',
  MINING_REWARD = 'mining_reward',
  AMBASSADOR_REWARD = 'growth_reward',
  POOL_REWARD = 'pool_reward',
  MARKET = 'market',
}

export enum UnlockRequestStatus {
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  PENDING = 'pending',
}

export interface ITransactionIO {
  amount: number;
  address: string;
  index: number;
  alias: string;
  isMine: boolean;
  data?: string;
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
  isMature: boolean;
  isSpent: boolean;
}

export interface IDisplayTransaction extends ITransaction {
  actionStr: string;
  actions: any[];
  walletId: string;
  isPendingEasySend: boolean;
  addressFrom: string;
  addressTo: string;
  type: 'credit' | 'debit' | 'none' | 'meritmoney' | 'meritinvite';
  input: string;
  output: string;
  safeConfirmed?: string;
  contact?: MeritContact;
  feeStr: string;
  to: { alias: string; address: string };
  from: { alias: string; address: string };
  displayWallet?: DisplayWallet;
  wallet: MeritWalletClient;
  isMiningReward: boolean;
  isGrowthReward: boolean;
  isPoolReward: boolean;
  isMarketPayment: boolean;
  isWalletUnlock: boolean;
  isConfirmed?: boolean;
  easySend?: EasySend;
  easySendUrl?: string;
  isSpent: boolean;
  cancelled: boolean;
  isNew: boolean;
}

export interface IVisitedTransaction {
  txid: string;
  counter: number;
}
