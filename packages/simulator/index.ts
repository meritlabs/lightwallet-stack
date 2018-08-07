import { MeritWalletClient } from '../lightwallet/common/merit-wallet-client';

// Parent Alias: webdemo
// Parent Address: mRSLCXZrU76xkSGZVPY3pQC4i9ExASu2aP
const NETWORK: string = 'testnet';
const BWSURL: string = 'http//127.0.0.1/bws/api';


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

  public async createWallet(): Promise<MeritWalletClient> {
    let walletClient: MeritWalletClient = this.getClient(null, {});
    
    walletClient.seedFromRandomWithMnemonic({
      network:  NETWORK,
      passphrase: "",
      account: 0
    });
    
    await walletClient.createWallet("test1", "me", 1, 1, {network: NETWORK, singleAddress: true, walletPrivKey: null, parentAddress: "mRSLCXZrU76xkSGZVPY3pQC4i9ExASu2aP", alias: this.randomString()})

    return walletClient;
  }


  private randomString(length = 5) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return "test" + text;
  }
  
}