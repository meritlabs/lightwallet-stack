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

  constructor(private logger: Logger,
              private profileService: ProfileService,
              private bwcService: BwcService) {
  }

  async importMnemonic(words: string, opts: any): Promise<MeritWalletClient> {

    const walletClient = this.bwcService.getClient(null, opts);

    this.logger.debug('Importing Wallet Mnemonic');
    words = this.normalizeMnemonic(words);

    await walletClient.importFromMnemonic(words, {
      network: opts.networkName,
      passphrase: opts.passphrase,
      entropySourcePath: opts.entropySourcePath,
      derivationStrategy: opts.derivationStrategy || 'BIP44',
      account: opts.account || 0
    });

    return this.profileService.addAndBindWalletClient(walletClient, {
      bwsurl: opts.bwsurl
    });
  }

  // TODO: Create an interface for BWC, and use it to type
  // it as it is sent around.
  async seedFromMnemonic(opts: any, walletClient: MeritWalletClient): Promise<MeritWalletClient> {
    try {
      opts.mnemonic = this.normalizeMnemonic(opts.mnemonic);

      walletClient.seedFromMnemonic(opts.mnemonic, {
        network: opts.networkName || ENV.network,
        passphrase: opts.passphrase,
        account: opts.account || 0,
        derivationStrategy: opts.derivationStrategy || 'BIP44'
      });

      return walletClient;
    } catch (ex) {
      this.logger.info(ex);
      throw new Error('Could not create: Invalid wallet recovery phrase');
    }
  }

  private normalizeMnemonic(words: string): string {
    if (!words || !words.indexOf) return words;
    let isJA = words.indexOf('\u3000') > -1;
    let wordList = words.split(/[\u3000\s]+/);

    return wordList.join(isJA ? '\u3000' : ' ');
  };
}
