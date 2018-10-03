import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular/util/events';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { ENV } from '@app/env';

export enum MWCErrors {
  AUTHENTICATION = 'MWC_AUTH_ERROR',
  CONNECTION = 'MWC_CONNECTION_ERROR'
}

@Injectable()
export class MWCService {
  private MWC: MeritWalletClient = this.getClient();
  buildTx: Function = this.MWC.buildTx;
  parseSecret: Function = this.MWC.parseSecret;

  constructor(private events: Events) {
  }

  public getMeritcore() {
    return this.MWC.Meritcore;
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

  public getClient(walletData?, opts?: { bwsurl?: string; verbose?: boolean; }): MeritWalletClient {
    if (!walletData && !opts && this.MWC) return this.MWC;

    opts = opts || {};

    const mwc = MeritWalletClient.getInstance({
      baseUrl: opts.bwsurl || ENV.mwsUrl,
      verbose: opts.verbose || false,
      timeout: 100000,
      transports: ['polling'],
    });

    if (walletData) {
      mwc.import(walletData);
    }

    if (!mwc.onAuthenticationError) {
      mwc.setOnAuthenticationError(() => {
        this.events.publish(MWCErrors.AUTHENTICATION);
      });
    }

    return mwc;
  }
}
