import { Injectable } from '@angular/core';

import * as BWC from 'bitcore-wallet-client';

@Injectable()
export class BwcProvider {
  public buildTx = BWC.buildTx;
  public parseSecret = BWC.parseSecret;
  public Client = BWC;
  constructor() {
    console.log('Hello BwcProvider Provider');
  }
  getBitcore() {
    return BWC.Bitcore;
  }

  getErrors() {
    return BWC.errors;
  }

  getSJCL() {
    return BWC.sjcl;
  }

  getUtils() {
    return BWC.Utils;
  }

  getClient(walletData, opts) {
    opts = opts || {};

    //note opts use `bwsurl` all lowercase;
    let bwc = new BWC({
      baseUrl: opts.bwsurl || 'https://mws.merit.me/mws/api',
      verbose: opts.verbose,
      timeout: 100000,
      transports: ['polling'],
    });
    if (walletData)
      bwc.import(walletData, opts);
    return bwc;
  }

}
