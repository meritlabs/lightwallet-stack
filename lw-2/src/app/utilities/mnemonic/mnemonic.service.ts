import { Injectable } from '@angular/core';
import { Logger } from '@nsalaun/ng-logger';
import { BwcService } from '../../core/bwc.service';
import { BwcError } from '../../core/bwc-error.model';
import { ProfileService } from '../../core/profile.service';


import * as _ from 'lodash';

@Injectable()
export class MnemonicService {

  constructor(
      private logger: Logger, 
      private bwcService: BwcService,
      private bwcErrorService: BwcError,
      private profileService: ProfileService,
  ){}

  private errors: any = this.bwcService.getErrors();
  

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
        account: opts.account || 0,
        coin: opts.coin
      }, (err: any) => {
        if (err) {
          if (err instanceof this.errors.NOT_AUTHORIZED) {
            return reject(err);
          }

          this.bwcErrorService.cb(err, 'Could not import').then((msg: string) => { //TODO getTextCatalog
            return reject(msg);
          });

        }

        this.profileService.addAndBindWalletClient(walletClient, {
          bwsurl: opts.bwsurl
        }).then((wallet: any) => {
          return resolve(wallet);
        }).catch((err: any) => {
          return reject(err);
        });
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
          derivationStrategy: opts.derivationStrategy || 'BIP44',
          coin: opts.coin
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