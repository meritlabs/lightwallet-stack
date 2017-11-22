import { MeritClient, IMeritClient } from './lib/index';

let BwcError = require('./lib/errors');

export interface IMeritWalletClient extends IMeritClient {
  sdsa: any;
  errors: any;
};

// Singleton to ensure that conserve and handle memory most effectively.
export class MeritWalletClient extends MeritClient implements IMeritWalletClient {
  private static _instance: MeritWalletClient;
  public errors;
  public sdsa;
  private constructor(opts:any = {}) {
    super(opts);
    this.errors = BwcError;
  }

  public static getInstance(opts:any = {}): MeritWalletClient {
    return (this._instance || new MeritWalletClient(opts));
  }
}


// Errors thrown by the library
