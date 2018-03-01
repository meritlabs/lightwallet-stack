import { MeritWalletClient } from '@merit/common/merit-wallet-client';

export interface IVault {

  amount: number;
  address: Array<string>;
  coins: Array<any>;
  masterPubKey: any;
  status: string;
  whitelist: Array<{address: string, alias: string}>;
  walletClient: MeritWalletClient;

}