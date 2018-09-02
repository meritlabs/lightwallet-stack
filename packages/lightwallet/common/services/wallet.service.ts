import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { EasySend } from '@merit/common/models/easy-send';
import { EasySendService } from '@merit/common/services/easy-send.service';
import { ConfigService } from '@merit/common/services/config.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { MnemonicService } from '@merit/common/services/mnemonic.service';
import { MWCService } from '@merit/common/services/mwc.service';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { Events } from 'ionic-angular/util/events';
import * as _ from 'lodash';
import { AlertService } from "@merit/common/services/alert.service";
import { TxProposal } from '@merit/common/models/tx-proposal';
import { Utils } from '@merit/common/merit-wallet-client/lib/common';
import { Transaction, HDPrivateKey, HDPublicKey, crypto } from 'bitcore-lib';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';

export function accessWallet(target, key: string, descriptor: any) {

  return {
    value: async function (...args:any[]) {
      const wallet: MeritWalletClient = args[0];

      if (!wallet || !wallet.credentials) {
        throw new Error(`first argument of ${key} method should be type of MeritWalletClient so we can check access`);
      }

      let password;
      if (wallet.isPrivKeyEncrypted()) {
        try {
          password = await this.alertCtrl.promptForWalletPassword(wallet);
        } catch (e) {
          console.warn(e);
          throw new Error('No access to wallet');
        }
      }

      if (password) {
        wallet.decryptPrivateKey(password);
        wallet.credentialsSaveAllowed = false;
      }

      let result = null;
      try {
        result = await descriptor.value.apply(this, args);
      } finally {
        if (password) {
          wallet.encryptPrivateKey(password);
          wallet.credentialsSaveAllowed = false;
        }
      }
      return result;
    }

  };
}

@Injectable()
export class WalletService {
  constructor(private logger: LoggerService,
              private mwcService: MWCService,
              private configService: ConfigService,
              private profileService: ProfileService,
              private persistenceService: PersistenceService,
              private persistenceService2: PersistenceService2,
              private mnemonicService: MnemonicService,
              private easySendService: EasySendService,
              private events: Events,
              private alertCtrl: AlertService
  ) {
  }

  isWalletEncrypted(wallet: MeritWalletClient) {
    return wallet.isPrivKeyEncrypted();
  }

  encryptWallet(wallet: MeritWalletClient, password: string): Promise<any> {
    wallet.encryptPrivateKey(password, {});
    return this.profileService.updateWallet(wallet);
  };

  decryptWallet(wallet: MeritWalletClient, password: string) {
    return wallet.decryptPrivateKey(password);
  }

  /** =============== TRANSACTIONS METHODS ============== */

  @accessWallet
  createTx(wallet: MeritWalletClient, txp: any): Promise<any> {
    return wallet.createTxProposal(txp);
  }

  @accessWallet
  async publishTx(wallet: MeritWalletClient, txp: any): Promise<any> {
    try {
      return wallet.publishTxProposal({ txp });
    } catch (err) {
      throw new Error('error publishing tx: ' + err);
    }
  }

  @accessWallet
  signTx(wallet: MeritWalletClient, txp: any): Promise<any> {
    return wallet.signTxProposal(txp);
  }

  @accessWallet
  broadcastTx(wallet: MeritWalletClient, txp: any): Promise<any> {
    if (txp.status != 'accepted')
      throw new Error('TX_NOT_ACCEPTED');

    return wallet.broadcastTxProposal(txp);
  }

  @accessWallet
  async sendTransaction(wallet: MeritWalletClient, txp: TxProposal) {
    const signedTx = await txp.getSignedRawTx();
    return wallet.broadcastRawTx(signedTx)
  }

  @accessWallet
  broadcastRawTx(wallet: MeritWalletClient, opts) {
    wallet.broadcastRawTx(opts);
  }

  @accessWallet
  rejectTx(wallet: MeritWalletClient, txp: any): Promise<any> {
    return wallet.rejectTxProposal(txp, null);
  }

  @accessWallet
  async removeTx(wallet: MeritWalletClient, txp: any): Promise<any> {
    return wallet.removeTxProposal(txp);
  }

  @accessWallet
  async onlyPublish(wallet: MeritWalletClient, txp: any): Promise<any> {
    const publishedTxp = await this.publishTx(wallet, txp);
    this.events.publish('Local:Tx:Publish', publishedTxp);
  }

  @accessWallet
  async publishAndSign(wallet: MeritWalletClient, txp: any): Promise<any> {

    if (txp.status != 'pending') {
      txp = await this.publishTx(wallet, txp);
    }

    return this.signAndBroadcast(wallet, txp);
  }

  @accessWallet
  private async signAndBroadcast(wallet: MeritWalletClient, publishedTxp: any): Promise<any> {
    let signedTxp = await this.signTx(wallet, publishedTxp);

    if (signedTxp.status == 'accepted') {
      const broadcastedTxp = await this.broadcastTx(wallet, signedTxp);
      this.events.publish('Local:Tx:Broadcast', broadcastedTxp);
      return broadcastedTxp;
    } else {
      this.events.publish('Local:Tx:Signed', signedTxp);
      return signedTxp;
    }
  }

  /**
   * Create and send invite tx to a given address
   *
   * @param {MeritWalletClient} wallet
   * @param {string} toAddress - merit address to send invite to
   * @param {number=1} [amount] - number of invites to send. defaults to 1
   * @param {string} [script]
   * @param {string} [message] - message to send to a receiver
   */
  @accessWallet
  async sendInvite(wallet: MeritWalletClient, toAddress: string, amount: number = 1, script = null, message: string = ''): Promise<any> {
    amount = parseInt(amount as any);

    const txp = TxProposal.create({
      fromAddress: wallet.displayWallet.address,
      toAddress,
      amount,
      utxos: wallet.displayWallet.utxos,
      isInvite: true,
      wallet: wallet.displayWallet,
    });

    txp.toScript = script;
    txp.setOutputs();

    console.log('TXP IS ', txp);

    if (wallet.displayWallet.balance.spendableInvites == 0) {
      throw new Error('You do not have free invites you can send');
    }

    const signedTx = await txp.getSignedRawTx();
    debugger;
    return wallet.broadcastRawTx(signedTx);
  }

  @accessWallet
  async sendMeritInvite(wallet: MeritWalletClient, invitesNumber: number = 1, password?: string) {
    const easySend = await this.easySendService.createEasySendScriptHash(wallet, password);
    easySend.inviteOnly = true;

    const referral = easySend.scriptReferralOpts;
    await wallet.sendReferral(referral);

    await this.sendInvite(wallet, referral.address, invitesNumber);

    await wallet.registerGlobalSend(easySend);

    return easySend;
  }


  /** =================== CREATE WALLET METHODS ================ */

  createDefaultWallet(parentAddress: string, alias: string) {
    return this.createWallet({ parentAddress, alias });
  }

  // TODO add typings for `opts`
  async createWallet(opts: any) {
    const showOpts = _.clone(opts);
    if (showOpts.extendedPrivateKey) showOpts.extendedPrivateKey = '[hidden]';
    if (showOpts.mnemonic) showOpts.mnemonic = '[hidden]';

    this.logger.debug('Creating Wallet:', showOpts);

    const wallet: MeritWalletClient = await this.seedWallet(opts);
    let name = opts.name || 'Personal Wallet'; // TODO GetTextCatalog
    let myName = opts.myName || 'me'; // TODO GetTextCatalog
    let m = opts.m || 1;
    let n = opts.n || 1;

    await wallet.createWallet(name, myName, m, n, {
      network: ENV.network,
      singleAddress: opts.singleAddress,
      walletPrivKey: opts.walletPrivKey,
      parentAddress: opts.parentAddress,
      alias: opts.alias
    });

    await this.profileService.addWallet(wallet);
    // TODO: Subscribe to ReferralTxConfirmation
    return wallet;
  }

  // TODO: Rename this.
  private async seedWallet(opts: any): Promise<MeritWalletClient> {

    let walletClient = this.mwcService.getClient(null, opts);

    if (opts.mnemonic) {
      try {
        return this.mnemonicService.seedFromMnemonic(opts, walletClient);
      } catch (ex) {
        this.logger.info(ex);
        throw new Error('Could not create: Invalid wallet recovery phrase'); // TODO getTextCatalog
      }
    } else if (opts.extendedPrivateKey) {
      try {
        walletClient.seedFromExtendedPrivateKey(opts.extendedPrivateKey, {
          network:  ENV.network,
          account: opts.account || 0,
          derivationStrategy: opts.derivationStrategy || 'BIP44'
        });
      } catch (ex) {
        this.logger.warn(ex);
        throw new Error('Could not create using the specified extended private key'); // TODO GetTextCatalog
      }
    } else if (opts.extendedPublicKey) {
      try {
        walletClient.seedFromExtendedPublicKey(opts.extendedPublicKey, opts.externalSource, opts.entropySource, {
          account: opts.account || 0,
          derivationStrategy: opts.derivationStrategy || 'BIP44'
        });
        walletClient.credentials.hwInfo = opts.hwInfo;
      } catch (ex) {
        this.logger.warn('Creating wallet from Extended Key Arg:', ex, opts);
        throw new Error('Could not create using the specified extended key'); // TODO GetTextCatalog
      }
    } else {
        walletClient.seedFromRandomWithMnemonic({
          network:  ENV.network,
          passphrase: opts.passphrase,
          account: 0
        });
    }
    return walletClient;
  }

  async getEncodedWalletInfo(wallet: MeritWalletClient, password: string): Promise<any> {
    const derivationPath = wallet.credentials.getBaseAddressDerivationPath();
    const encodingType = {
      mnemonic: 1,
      xpriv: 2,
      xpub: 3
    };
    let info: any = {};

    // not supported yet
    if (wallet.credentials.derivationStrategy != 'BIP44' || !wallet.canSign())
      throw new Error('Exporting via QR not supported for this wallet'); //TODO gettextcatalog

    const keys = wallet.getKeys(password);
    if (keys.mnemonic) {
      info = {
        type: encodingType.mnemonic,
        data: keys.mnemonic
      };
    } else {
      info = {
        type: encodingType.xpriv,
        data: keys.xPrivKey
      };
    }

    return info.type + '|' + info.data + '|' + wallet.credentials.network.toLowerCase() + '|' + derivationPath + '|' + (wallet.credentials.mnemonicHasPassphrase);
  }


  /** ================ PREFERENCES METHODS ========================  **/

  async setHiddenBalanceOption(walletId: string, hideBalance: boolean): Promise<void> {
      await this.persistenceService.setHideBalanceFlag(walletId, String(hideBalance));
  }

  private updateRemotePreferencesFor(clients: any[], prefs: any): Promise<any> {
    return Promise.all(clients.map((wallet: any) =>
      wallet.savePreferences(prefs)
    ));
  }

  async updateRemotePreferences(clients: any[], prefs: any = {}): Promise<any> {
    if (!_.isArray(clients))
      clients = [clients];

    // Update this JIC.
    let config: any = this.configService.get();
    prefs.email = config.emailNotifications.email;
    prefs.language = 'en';

    Promise.all(clients.map(async (w) => w.savePreferences(prefs) ));

    clients.forEach(c => {
      c.preferences = _.assign(prefs, c.preferences);
    });
  }

  /** ================= IMRORT METHODS ====================== */

  async importExtendedPublicKey(opts: any): Promise<any> {
    const walletClient = this.mwcService.getClient(null, opts);

    try {
      await walletClient.importFromExtendedPublicKey(opts.extendedPublicKey, opts.externalSource, opts.entropySource, {
        account: opts.account || 0,
        derivationStrategy: opts.derivationStrategy || 'BIP44'
      });

      return this.profileService.addWallet(walletClient);
    } catch (err) {
      this.logger.warn(err);
      throw new Error(err.text || 'Error while importing wallet');
    }
  }

  async importExtendedPrivateKey(xPrivKey: string, opts: any): Promise<any> {

    const walletClient = this.mwcService.getClient(null, opts);
    this.logger.debug('Importing Wallet xPrivKey');

    try {
      await walletClient.importFromExtendedPrivateKey(xPrivKey, opts);
      return this.profileService.addWallet(walletClient);
    } catch (err) {
      this.logger.warn(err);
      throw new Error(err.text || 'Error while importing wallet');
    }
  }

  async importWallet(str: string, opts: any): Promise<MeritWalletClient> {
    let walletClient = this.mwcService.getClient(null, opts);

    this.logger.debug('Importing Wallet:', opts);

    try {
      let c = JSON.parse(str);

      if (c.xPrivKey && c.xPrivKeyEncrypted) {
        this.logger.warn('Found both encrypted and decrypted key. Deleting the encrypted version');
        delete c.xPrivKeyEncrypted;
        delete c.mnemonicEncrypted;
      }

      str = JSON.stringify(c);

      walletClient.import(str);

      return this.profileService.addWallet(walletClient);
    } catch (err) {
      throw new Error('Could not import. Check input file and spending password'); // TODO getTextCatalog
    }
  }

}
