import { MeritWalletClient } from '@merit/common/merit-wallet-client';

export interface IVault {

  amount: number;
  address: {hash: string, network: string, type: string};
  coins: Array<any>;
  masterPubKey: any;
  status: string;
  whiteList: Array<{address: string, alias: string}>;
  walletClient: MeritWalletClient;

}