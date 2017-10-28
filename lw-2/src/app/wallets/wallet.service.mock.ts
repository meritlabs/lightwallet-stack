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

}