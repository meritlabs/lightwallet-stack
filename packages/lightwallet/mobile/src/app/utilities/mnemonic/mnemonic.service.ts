import { Injectable } from '@angular/core';
import { BwcError } from '@merit/mobile/app/core/bwc-error.model';
import { BwcService } from '@merit/mobile/app/core/bwc.service';
import { Logger } from '@merit/mobile/app/core/logger';
import { ProfileService } from '@merit/mobile/app/core/profile.service';
import { ConfigService } from '@merit/mobile/app/shared/config.service';
import { ENV } from '@app/env';
import { MeritWalletClient } from '../../../lib/merit-wallet-client/index';

@Injectable()
export class MnemonicService {

  private errors: any;

  constructor(private logger: Logger,
              private profileService: ProfileService,
              private bwcService: BwcService,
              private bwcErrorService: BwcError,
              private configService: ConfigService) {
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
        let network = opts.networkName || ENV.network;
        walletClient.seedFromMnemonic(opts.mnemonic, {
          network: network,
          passphrase: opts.passphrase,
          account: opts.account || 0,
          derivationStrategy: opts.derivationStrategy || 'BIP44'
        });
        return resolve(walletClient);
      } catch (ex) {
        this.logger.info(ex);
        return reject(new Error('Could not create: Invalid wallet recovery phrase')); // TODO getTextCatalog
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
