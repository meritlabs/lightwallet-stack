import { MeritClient } from './lib/index';
let BwcError = require('./lib/errors');

// Singleton to ensure that conserve and handle memory most effectively.
export class Client extends MeritClient {
  private static _instance: Client;
  public errors;
  private constructor(opts:any = {}) {
    super({opts});
    this.errors = BwcError;
  }

  public static getInstance(opts:any = {}): Client {
    return (this._instance || new Client(opts));
  }
}


// Errors thrown by the library
