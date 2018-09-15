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
  PENDING = 'pending'
}

export interface ITransactionIO {
  amount: number;
  amountMicros: number;
  address?: string;
  n: number;
  alias?: string;
  isChange?: boolean;
  data?: string;
  txid?: string;
  spentTxId?: string;
  spentIndex?: number;
  spentHeight?: number;
}

export interface ITransaction {
  txid: string;
  action: TransactionAction;
  amount: number;
  amountMicros: number;
  alternativeAmountStr?: string;
  fees: number;
  time: number;
  confirmations?: number;
  outputs?: ITransactionIO[];
  inputs?: ITransactionIO[];
  isCoinbase?: number;
  isInvite?: number;
  isMature?: boolean;
  height?: number;
}

export interface IDisplayTransaction extends ITransaction {
  actionStr?: string;
  walletId: string;
  name: string;
  addressFrom: string;
  addressTo: string;
  type: 'credit' | 'debit' | 'none' | 'meritmoney' | 'meritinvite';
  contact?: MeritContact;
  displayWallet?: DisplayWallet;
  wallet?: MeritWalletClient;
  isMiningReward?: boolean;
  isGrowthReward?: boolean;
  isPoolReward?: boolean;
  isMarketPayment?: boolean;
  isWalletUnlock?: boolean;
  isConfirmed?: boolean;
  easySend?: EasySend;
  easySendUrl?: string;
  claimed?: boolean;
  claimedBy?: string;
  isSpent?: boolean;
  cancelled?: boolean;
  isNew?: boolean;
  isVault?: boolean;
  isMempool?: boolean;
  image?: string;
  isCredit?: boolean;
}

export interface IVisitedTransaction {
  txid: string;
  counter: number;
}

export interface IHistoryFilters {
  growth_reward: boolean;
  mining_reward: boolean;
  sent: boolean;
  received: boolean;
  meritmoney: boolean;
  meritinvite: boolean;
  market: boolean;
  pool_reward: boolean;
  invite: boolean;
}

export const DEFAULT_HISTORY_FILTERS = {
  growth_reward: true,
  mining_reward: true,
  sent: true,
  received: true,
  meritmoney: true,
  meritinvite: true,
  market: true,
  pool_reward: true,
  invite: true,
};
