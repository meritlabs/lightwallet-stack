import { Injectable } from '@angular/core';

// TODO: Import the NPM package directly. 
// Depends on creating typings and publishing the pkg.
import { MeritWalletClient } from './../../../../merit-wallet-client';

import { ConfigService } from 'merit/shared/config.service';

@Injectable()
export class BwcService {
  private BWC: any;
  public buildTx: any; // = BWC.buildTx;
  public parseSecret: any; // = BWC.parseSecret;
  
  constructor(
    private configService:ConfigService
  ) {
    let opts = {
          bwsurl: this.configService.get().bws.url
    };
    this.BWC = this.getClient(null, null);
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

  public getClient(walletData, opts:any = {}): MeritWalletClient {
    opts = opts || {};

    //note opts use `bwsurl` all lowercase;
    let bwc = MeritWalletClient.getInstance({
      baseUrl: opts.bwsurl || 'http://localhost:3232/bws/api',
      verbose: opts.verbose || false,
      timeout: 100000,
      transports: ['polling'],
    });
    if (walletData)
      bwc.import(walletData);
    return bwc;
  }

}