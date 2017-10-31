import { Injectable } from '@angular/core';

import {Profile} from "./profile.model";
import {Wallet} from "merit/wallets/wallet.model";
import {WalletMock} from "merit/wallets/wallet.model.mock";
import {Logger} from "merit/core/logger";

@Injectable()
export class ProfileServiceMock  {

  constructor(
    private logger:Logger
  ) {
    this.logger.warn("Using service mock! ProfileServiceMock");
  }

  getWallets():Promise<Array> {

    return new Promise((rs,rj) => {
      rs([
        new WalletMock({id: '1', name: 'Empty wallet'}),
        new WalletMock({id: '2', color: 'orange', name: 'Hidden balance wallet', balanceHidden: true}),
        new WalletMock({id: '3', color: 'darkblue', name: 'Cached balance wallet', cachedBalance: '10 bits', cachedBalanceUpdatedOn: 1508229051}),
        new WalletMock({id: '4', color: 'red', name: 'Locked wallet', locked: true }),
        new WalletMock({id: '5', color: 'darkgreen', name: 'Incomplete wallet', _isComplete: false, secret: '123456789'}),
        new WalletMock({id: '6', color: undefined, name: 'Multisig wallet', m: 2}),
        new WalletMock({id: '7', color: 'darkcyan', name: 'Processing wallet', status: {totalBalanceStr: '10 bits', totalBalanceMicros: 10, spendableAmount: 0}}),
        new WalletMock({id: '8', color: 'darkslateblue', name: 'Error wallet', error: 'Some error'}),
      ]);
    });

  }

  public getTxps(opts: any): Promise<any> {
    return new Promise((resolve, reject) => {

      resolve({
        txps: [
          {message: 'txps message', amountStr: '10 micros', createdOn: ((new Date()).getTime()/1000 - 1234), action: 'sent'},
          {toAddress: '123', amountStr: '10 micros', action: 'invalid'},
          {merchant: {domain: 'mock domain', pr: {ca: true}}, amountStr: '10 micros', action: 'sent'}
        ],
        txpsN: 4
      });

    });
  };

  public getNotifications(opts: any): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve({
        notifications: [],
        total: 0
      });
    });
  }

}

