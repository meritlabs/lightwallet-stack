import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IDisplayTransaction } from '@merit/common/models/transaction';

export interface AppState {
  wallets: DisplayWallet[];
  transactions: IDisplayTransaction[];
}
