import { Injectable } from '@angular/core';

import {ConfigService} from "merit/shared/config.service";
import { Events } from 'ionic-angular';


// TODO: Import the NPM package directly. 
// Depends on creating typings and publishing the pkg.
import { MeritWalletClient } from './../../lib/merit-wallet-client';

@Injectable()
export class BwcService {
  private BWC: MeritWalletClient;
  public buildTx: Function; // = BWC.buildTx;
  public parseSecret: Function; // = BWC.parseSecret;
  
  constructor(
    private config:ConfigService,
    private events: Events
  ) {
    this.BWC = this.getClient(null);
    this.buildTx = this.BWC.buildTx;
    this.parseSecret = this.BWC.parseSecret;
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

  public getClient(walletData, opts: any = {}): MeritWalletClient {
    //note opts use `bwsurl` all lowercase;

    let bwc = MeritWalletClient.getInstance( {
      baseUrl: opts.bwsurl || this.config.get().bws.url,
      verbose: opts.verbose || false,
      timeout: 100000,
      transports: ['polling'],
    });
    if (walletData)
      bwc.import(walletData);

    if (!bwc.onAuthenticationError) {
      bwc.setOnAuthenticationError(() => {
        this.events.publish(MWCErrors.AUTHENTICATION);
      });
    }

    return bwc;
  }

}

export class MWCErrors {

  public static AUTHENTICATION = 'MWC_AUTH';

  public static CONNECTION = 'CONNECTION';

}
