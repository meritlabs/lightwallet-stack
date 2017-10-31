import { Injectable } from '@angular/core';
import {Logger} from "merit/core/logger";
import {WalletMock} from "merit/wallets/wallet.model.mock";
import {Wallet} from "merit/wallets/wallet.model";


@Injectable()
export class WalletServiceMock {

  constructor(
    private logger: Logger
  ) {
    this.logger.warn("Using mock service! WalletServiceMock");
  }
  public createDefaultWallet(): Promise<any> {
    return new Promise((resolve, reject) => {
        resolve();
    });
  };

  public createWallet(opts: any): Promise<Wallet> {
    return new Promise((resolve, reject) => {
      resolve(new WalletMock({}));
    });
  }

  getWalletAnv(wallet:Wallet):Promise<number> {
    return new Promise((resolve, reject) => {
      resolve(
        (wallet.status && wallet.status.totalBalanceMicros) ? wallet.status.totalBalanceMicros : 0
      )
    });
  }

  public getAddress(wallet: any, forceNew: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve([]);
    });
  }

  public getStatus(wallet:any, opts:any):Promise<any> {
    return new Promise((resolve, reject) => {
      resolve({totalBalanceStr: '0 bits', totalBalanceAlternative: '0.0', alternativeIsoCode: 'USD', totalBalanceMicros: 0, spendableAmount: 0});
    })
  }

}