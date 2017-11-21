import { Injectable } from '@angular/core';

import {ConfigService} from "merit/shared/config.service";


// TODO: Import the NPM package directly. 
// Depends on creating typings and publishing the pkg.
import { MeritWalletClient, IMeritWalletClient } from './../../lib/merit-wallet-client';

@Injectable()
export class BwcService {
  private BWC: IMeritWalletClient;
  public buildTx: Function; // = BWC.buildTx;
  public parseSecret: Function; // = BWC.parseSecret;
  
  constructor(
    private config:ConfigService
  ) {
    this.BWC = this.getClient(null);
    this.buildTx = this.BWC.buildTx;
    this.parseSecret = this.BWC.parseSecret;
    console.log('Hello BwcService Service');
    console.log("the client: ")
    console.log(this.BWC)
  }
  
  public getBitcore() {
    console.log("Getting bitcore")
    console.log(this.BWC)
    console.log(this.BWC.Bitcore)
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

  public getClient(walletData, opts: any = {}): IMeritWalletClient {
    //note opts use `bwsurl` all lowercase;
    let bwc = MeritWalletClient.getInstance({
      baseUrl: opts.bwsurl || this.config.get().bws.url,
      verbose: opts.verbose || false,
      timeout: 100000,
      transports: ['polling'],
    });
    if (walletData)
      bwc.import(walletData);
    return bwc;
  }

}
