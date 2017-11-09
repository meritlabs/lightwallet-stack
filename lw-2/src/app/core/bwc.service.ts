import { Injectable } from '@angular/core';

import { Client } from './../../../../packages/merit-wallet-client';

@Injectable()
export class BwcService {
  private BWC: any;
  public buildTx: any; // = BWC.buildTx;
  public parseSecret: any; // = BWC.parseSecret;
  constructor(opts: any = {}) {
    this.BWC = Client.getInstance(opts);
    this.buildTx = this.BWC.buildTx;
    this.parseSecret = this.BWC.parseSecret;
    console.log('Hello BwcService Service');
  }
  
  public getBitcore() {
    return this.BWC.Bitcore;
  }

  public getErrors() {
    return this.BWC.errors;
  }

  public getSJCL() {
    return this.BWC.sjcl;
  }

  public getUtils() {
    return this.BWC.Utils;
  }

  getClient(walletData, opts) {
    opts = opts || {};

    //note opts use `bwsurl` all lowercase;
    let bwc = Client.getInstance({
      baseUrl: opts.bwsurl || 'http://localhost:3232/bws/api',
      verbose: opts.verbose,
      timeout: 100000,
      transports: ['polling'],
    });
    if (walletData)
      bwc.import(walletData);
    return bwc;
  }

}
