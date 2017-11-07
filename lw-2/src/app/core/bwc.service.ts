import { Injectable } from '@angular/core';

//import * as BWC from  './../../lib/bwc';
import { Client as BWC } from './../../lib/bwc/bwc-ts';

@Injectable()
export class BwcService {
  public buildTx = BWC.buildTx;
  public parseSecret = BWC.parseSecret;
  public Client = BWC;
  constructor() {
    console.log('Hello BwcService Service');
  }
  public getBitcore() {
    return BWC.Bitcore;
  }

  public getErrors() {
    return BWC.errors;
  }

  public getSJCL() {
    return BWC.sjcl;
  }

  public getUtils() {
    return BWC.Utils;
  }

  getClient(walletData, opts) {
    opts = opts || {};

    //note opts use `bwsurl` all lowercase;
    let bwc = new BWC({
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
