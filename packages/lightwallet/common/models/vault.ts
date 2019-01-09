import { MeritWalletClient } from '@merit/common/merit-wallet-client';

export interface IVault {
  _id: string;
  name: string;
  amount: number;
  address: string;
  coins: Array<any>;
  masterPubKey: any;
  status: string;
  whitelist: Array<{ address: string; alias: string }>;
  walletClient: MeritWalletClient;
}
