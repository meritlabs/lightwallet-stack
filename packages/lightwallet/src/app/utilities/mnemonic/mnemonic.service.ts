import { Injectable } from '@angular/core';
import { Logger } from 'merit/core/logger';
import { BwcService } from 'merit/core/bwc.service';
import { BwcError } from 'merit/core/bwc-error.model';
import { ProfileService } from 'merit/core/profile.service';
import * as Promise from 'bluebird';



import * as _ from 'lodash';
import { MeritWalletClient } from 'src/lib/merit-wallet-client';
import { ConfigService } from 'merit/shared/config.service';

@Injectable()
export class MnemonicService {

  private errors: any;

  constructor(
      private logger: Logger,
      private profileService: ProfileService,
      private bwcService: BwcService,
      private bwcErrorService: BwcError,
      private configService: ConfigService
  ){
    this.errors = this.bwcService.getErrors();
  }




  public importMnemonic(words: string, opts: any): Promise<MeritWalletClient> {
    return new Promise((resolve, reject) => {

      var walletClient = this.bwcService.getClient(null, opts);

      this.logger.debug('Importing Wallet Mnemonic');

      words = this.normalizeMnemonic(words);
      return walletClient.importFromMnemonic(words, {
        network: opts.networkName,
        passphrase: opts.passphrase,
        entropySourcePath: opts.entropySourcePath,
        derivationStrategy: opts.derivationStrategy || 'BIP44',
        account: opts.account || 0
      }).then(() => {
        return this.profileService.addAndBindWalletClient(walletClient, {
          bwsurl: opts.bwsurl
        }).then((wallet) => {
          return resolve(wallet);
        }).catch((err: any) => {
          return reject(err);
        });
      }).catch((err) => {
        reject(err);
      });
    });
  }

  // TODO: Create an interface for BWC, and use it to type
  // it as it is sent around.
  public seedFromMnemonic(opts: any, walletClient: MeritWalletClient): Promise<MeritWalletClient> {
    return new Promise((resolve, reject) => {
      try {
        opts.mnemonic = this.normalizeMnemonic(opts.mnemonic);
        let network = opts.networkName || this.configService.getDefaults().network.name;
        walletClient.seedFromMnemonic(opts.mnemonic, {
          network: network,
          passphrase: opts.passphrase,
          account: opts.account || 0,
          derivationStrategy: opts.derivationStrategy || 'BIP44'
        });
        return resolve(walletClient);
      } catch (ex) {
        this.logger.info(ex);
        return reject('Could not create: Invalid wallet recovery phrase'); // TODO getTextCatalog
      }
    })
  }

  private normalizeMnemonic(words: string): string {
    if (!words || !words.indexOf) return words;
    let isJA = words.indexOf('\u3000') > -1;
    let wordList = words.split(/[\u3000\s]+/);

    return wordList.join(isJA ? '\u3000' : ' ');
  };
}