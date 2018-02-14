import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

import { ConfigService } from 'merit/shared/config.service';
// TODO: Import the NPM package directly.
// Depends on creating typings and publishing the pkg.
import { MeritWalletClient } from '../../lib/merit-wallet-client';

import { ENV } from '@app/env';

@Injectable()
export class BwcService {
  public buildTx: Function; // = BWC.buildTx;
  public parseSecret: Function; // = BWC.parseSecret;
  private MWC: MeritWalletClient;

  constructor(private config: ConfigService,
              private events: Events) {
    this.MWC = this.getClient(null);
    this.buildTx = this.MWC.buildTx;
    this.parseSecret = this.MWC.parseSecret;
  }

  public getBitcore() {
    return this.MWC.Bitcore;
  }

  public getErrors() {
    return this.MWC.errors;
  }

  public getSJCL() {
    return this.MWC.sjcl;
  }

  public getUtils() {
    return this.MWC.Utils;
  }

  public getClient(walletData, opts: any = {}): MeritWalletClient {
    //note opts use `bwsurl` all lowercase;

    console.log('MWC', opts.bwsurl, ENV.mwsUrl);

    let mwc = MeritWalletClient.getInstance({
      baseUrl: opts.bwsurl || ENV.mwsUrl,
      verbose: opts.verbose || false,
      timeout: 100000,
      transports: ['polling'],
    });
    if (walletData)
      mwc.import(walletData);

    if (!mwc.onAuthenticationError) {
      mwc.setOnAuthenticationError(() => {
        this.events.publish(MWCErrors.AUTHENTICATION);
      });
    }

    return mwc;
  }

}

export class MWCErrors {

  public static AUTHENTICATION = 'MWC_AUTH_ERROR';

  public static CONNECTION = 'MWC_CONNECTION_ERROR';

}
