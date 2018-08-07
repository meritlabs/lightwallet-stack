import { MeritWalletClient } from '../lightwallet/common/merit-wallet-client';


export class MeritSimulator {

  public getClient(walletData?, opts?: { bwsurl?: string; verbose?: boolean; }): MeritWalletClient {
    opts = opts || {bwsurl: "http//127.0.0.1/bws/api", verbose: true};
  
    const mwc = MeritWalletClient.getInstance({
      baseUrl: opts.bwsurl,
      verbose: opts.verbose || false,
      timeout: 100000,
      transports: ['polling'],
    });

    return mwc;
  }

  public createWallet() {
    
  }
}