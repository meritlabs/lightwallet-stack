import { MeritWalletClient } from '@merit/common/merit-wallet-client';

export interface IVault {

  address: string;
  whiteList: Array<{address: string, alias: string}>;
  walletClient: MeritWalletClient;

}