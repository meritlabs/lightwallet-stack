import { EasySend } from '@merit/common/models/easy-send';
import { MeritContact } from './merit-contact';
import { DisplayWallet } from './display-wallet';
import { MeritWalletClient } from "@merit/common/merit-wallet-client/index";

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
  address: string;
  n: number;
  alias: string;
  isChange: boolean;
  data?: string;
  txid: string;
  spentTxId?: string;
  spentIndex?: number;
  spentHeight?: number;
}

export interface ITransaction {
  txid: string;
  action: TransactionAction;
  amount: number;
  amountStr: string;
  amountMicros: number;
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
  isCoinbase: number;
  isInvite: number;
  isMature: boolean;
  isSpent: boolean;
  height: number;
}

export interface IDisplayTransaction extends ITransaction {
  actionStr: string;
  walletId: string;
  name: string;
  addressFrom: string;
  addressTo: string;
  type: 'credit' | 'debit' | 'none' | 'meritmoney' | 'meritinvite';
  input: string;
  output: string;
  contact?: MeritContact;
  feeStr: string;
  to: { alias: string; address: string; };
  from: { alias: string; address: string; };
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
  claimed?: boolean;
  claimedBy?: string;
  isSpent: boolean;
  cancelled?: boolean;
  isNew: boolean;
  isVault?: boolean;
  isMempool?: boolean;
}

export interface IVisitedTransaction {
  txid: string;
  counter: number;
}
