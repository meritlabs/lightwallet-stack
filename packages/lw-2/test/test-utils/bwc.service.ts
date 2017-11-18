import { MeritWalletClient, IMeritWalletClient } from './../../src/lib/merit-wallet-client';

export class BwcService {
  private BWC: IMeritWalletClient;
  public buildTx: Function; // = BWC.buildTx;
  public parseSecret: Function; // = BWC.parseSecret;
  
  constructor() {
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

  public getClient(walletData, opts: any = {}): IMeritWalletClient {
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