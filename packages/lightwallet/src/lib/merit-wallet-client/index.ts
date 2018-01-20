import { MeritClient } from './lib/index';
import * as BwcError from './lib/errors';

// Singleton to ensure that conserve and handle memory most effectively.
export class MeritWalletClient extends MeritClient {
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
