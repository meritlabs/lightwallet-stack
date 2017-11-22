import { Injectable } from '@angular/core';
import { Logger } from 'merit/core/logger';
import { BwcService } from 'merit/core/bwc.service';
import { BwcError } from 'merit/core/bwc-error.model';
import { ProfileService } from 'merit/core/profile.service';
import * as Promise from 'bluebird';



import * as _ from 'lodash';

@Injectable()
export class MnemonicService {

  private errors: any;

  constructor(
      private logger: Logger, 
      private profileService: ProfileService,
      private bwcService: BwcService,
      private bwcErrorService: BwcError
  ){
    this.errors = this.bwcService.getErrors();
  }


  

  public importMnemonic(words: string, opts: any): Promise<any> {
    return new Promise((resolve, reject) => {

      var walletClient = this.bwcService.getClient(null, opts);

      this.logger.debug('Importing Wallet Mnemonic');

      words = this.normalizeMnemonic(words);
      walletClient.importFromMnemonic(words, {
        network: opts.networkName,
        passphrase: opts.passphrase,
        entropySourcePath: opts.entropySourcePath,
        derivationStrategy: opts.derivationStrategy || 'BIP44',
        account: opts.account || 0
      }).then(() => {
        this.profileService.addAndBindWalletClient(walletClient, {
          bwsurl: opts.bwsurl
        }).then((wallet: any) => {
          return resolve(wallet);
        }).catch((err: any) => {
          return reject(err);
        });
      }).catch((err) => {
          if (err instanceof this.errors.NOT_AUTHORIZED) {
            return reject(err);
          }
          return (this.bwcErrorService.cb(err, 'Could not import'));
      });
    });
  }

  // TODO: Create an interface for BWC, and use it to type 
  // it as it is sent around.
  public seedFromMnemonic(opts: any, walletClient: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        opts.mnemonic = this.normalizeMnemonic(opts.mnemonic);
        let network = opts.networkName || 'livenet';
        walletClient.seedFromMnemonic(opts.mnemonic, {
          network: network,
          passphrase: opts.passphrase,
          account: opts.account || 0,
          derivationStrategy: opts.derivationStrategy || 'BIP44'
        });
        resolve(walletClient);
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