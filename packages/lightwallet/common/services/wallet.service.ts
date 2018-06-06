import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { MWCErrors } from '@merit/common/merit-wallet-client/lib/errors';
import { EasySend } from '@merit/common/models/easy-send';
import { FiatAmount } from '@merit/common/models/fiat-amount';
import { ConfigService } from '@merit/common/services/config.service';
import { EasySendService } from '@merit/common/services/easy-send.service';
import { LanguageService } from '@merit/common/services/language.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { MnemonicService } from '@merit/common/services/mnemonic.service';
import { MWCService } from '@merit/common/services/mwc.service';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { PopupService } from '@merit/common/services/popup.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { RateService } from '@merit/common/services/rate.service';
import { TxFormatService } from '@merit/common/services/tx-format.service';
import { Events } from 'ionic-angular/util/events';
import { AlertController } from 'ionic-angular';
import * as _ from 'lodash';

import 'rxjs/add/observable/defer';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/range';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/zip';
import { Observable } from 'rxjs/Observable';


function accessWallet(target, key: string, descriptor: any) {

  function askForPassword(wallet) {
    return new Promise((resolve, reject) => {
      let showPassPrompt = (highlightInvalid = false) => {
        this.alertCtrl
          .create({
            title: 'Enter spending password',
            cssClass: highlightInvalid ? 'invalid-input-prompt password-prompt' : 'password-prompt',
            inputs: [ { name: 'password', placeholder: 'Password', type: 'text' } ],
            buttons: [
              {text: 'Cancel', role: 'cancel', handler: () => { reject(); }},
              { text: 'Ok', handler: data => {
                if (!data.password) {
                  showPassPrompt(true);
                } else {
                  try {
                    wallet.decryptPrivateKey(data.password);
                    wallet.encryptPrivateKey(data.password);
                    resolve(data.password);
                  } catch (e) {
                    showPassPrompt(true);
                  }
                }
              }
              }
            ]
          }).present();
      };

      showPassPrompt();
    });
  }

  return {
    value: async function (...args:any[]) {

      let wallet = args[0];
      if (!wallet || !wallet.credentials) {
        throw new Error(`first argument of ${key} method should be type of MeritWalletClient so we can check access`);
      }

      let password = null;
      if (wallet.isPrivKeyEncrypted()) {
        try {
          password = await askForPassword.apply(this, [wallet]);
        } catch (e) {
          throw new Error('No access to wallet');
        }
      }

      if (password) {
        wallet.decryptPrivateKey(password);
        wallet.credentialsSaveAllowed = false;
      }
      try {
        var result = await descriptor.value.apply(this, args);
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


/* Refactor CheckList:
 - Bwc Error provider
 - Remove ongoingProcess provider, and handle Loading indicators in controllers
 - Decouple the tight dependencies on ProfileService; and create logical separation concerns
 - Ensure that anything returning a promise has promises through the stack.
 */
@Injectable()
export class WalletService {


  constructor(private logger: LoggerService,
              private mwcService: MWCService,
              private txFormatService: TxFormatService,
              private configService: ConfigService,
              private profileService: ProfileService,
              private persistenceService: PersistenceService,
              private rateService: RateService,
              private popupService: PopupService,
              private languageService: LanguageService,
              private mnemonicService: MnemonicService,
              private easySendService: EasySendService,
              private events: Events,
              private alertCtrl: AlertController
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

  /** =================== CREATE WALLET METHODS ================ */

  // TODO add typings for `opts`
  async createWallet(opts: any) {
    const wallet = await this.doCreateWallet(opts);
    wallet.name = opts.name || 'Personal Wallet';
    await this.profileService.addWallet(wallet);
    return wallet;
  }

  createDefaultWallet(parentAddress: string, alias: string) {
    const opts: any = {
      m: 1,
      n: 1,
      networkName: ENV.network,
      parentAddress,
      alias
    };
    return this.createWallet(opts);
  }


  // Creates a wallet on BWC/BWS
  private async doCreateWallet(opts: any): Promise<any> {
    const showOpts = _.clone(opts);
    if (showOpts.extendedPrivateKey) showOpts.extendedPrivateKey = '[hidden]';
    if (showOpts.mnemonic) showOpts.mnemonic = '[hidden]';

    this.logger.debug('Creating Wallet:', showOpts);

    const seed = async () => {
      const walletClient: MeritWalletClient = await this.seedWallet(opts);
      let name = opts.name || 'Personal Wallet'; // TODO GetTextCatalog
      let myName = opts.myName || 'me'; // TODO GetTextCatalog

      await walletClient.createWallet(name, myName, opts.m, opts.n, {
        network: opts.networkName,
        singleAddress: opts.singleAddress,
        walletPrivKey: opts.walletPrivKey,
        parentAddress: opts.parentAddress,
        alias: opts.alias
      });

      // TODO: Subscribe to ReferralTxConfirmation
      return walletClient;
    };

    return Observable.defer(() => seed())
      .retryWhen(errors =>
        errors
          .zip(Observable.range(1, 3))
          .mergeMap(([err, i]) => {
            this.logger.warn('Error creating wallet in DCW: ', err);
            if (err == MWCErrors.CONNECTION_ERROR && i < 3) {
              return Observable.timer(2000);
            }

            if (err && err.message === 'Checksum mismatch') {
              err = MWCErrors.REFERRER_INVALID;
            }

            return Observable.throw(err);
          })
      )
      .toPromise();
  }

  // TODO: Rename this.
  private async seedWallet(opts: any): Promise<MeritWalletClient> {
    opts = opts ? opts : {};
    let walletClient = this.mwcService.getClient(null, opts);
    let network = opts.networkName || ENV.network;

    if (opts.mnemonic) {
      try {
        // TODO: Type the walletClient
        return this.mnemonicService.seedFromMnemonic(opts, walletClient);
      } catch (ex) {
        this.logger.info(ex);
        throw new Error('Could not create: Invalid wallet recovery phrase'); // TODO getTextCatalog
      }
    } else if (opts.extendedPrivateKey) {
      try {
        walletClient.seedFromExtendedPrivateKey(opts.extendedPrivateKey, {
          network: network,
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
      let lang = this.languageService.getCurrent();
      try {
        walletClient.seedFromRandomWithMnemonic({
          network: network,
          passphrase: opts.passphrase,
          language: lang,
          account: 0
        });
      } catch (e) {
        this.logger.info('Error creating recovery phrase: ' + e.message);
        if (e.message.indexOf('language') > 0) {
          this.logger.info('Using default language for recovery phrase');
          walletClient.seedFromRandomWithMnemonic({
            network: network,
            passphrase: opts.passphrase,
            account: 0
          });
        } else {
          throw new Error(e);
        }
      }
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

    let keys = wallet.getKeys(password);
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
    const wallets = this.profileService.getWallets();
    let wallet = wallets.find(w => w.id == walletId);
    if (wallet) {
      await this.persistenceService.setHideBalanceFlag(walletId, String(hideBalance));
    }
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
