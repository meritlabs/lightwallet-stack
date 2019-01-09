import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
import { LoggerService } from '@merit/common/services/logger.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { MWCService } from '@merit/common/services/mwc.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';

@Injectable()
export class MnemonicService {
  constructor(private logger: LoggerService, private profileService: ProfileService, private mwcService: MWCService) {}

  async importMnemonic(words: string, opts: any): Promise<MeritWalletClient> {
    const walletClient = this.mwcService.getClient(null, opts);

    this.logger.debug('Importing Wallet Mnemonic');
    words = this.normalizeMnemonic(words);

    await walletClient.importFromMnemonic(words, {
      network: opts.networkName,
      passphrase: opts.passphrase,
      entropySourcePath: opts.entropySourcePath,
      derivationStrategy: opts.derivationStrategy || 'BIP44',
      account: opts.account || 0,
    });

    return this.profileService.addWallet(walletClient);
  }

  // TODO: Create an interface for MWC, and use it to type
  // it as it is sent around.
  async seedFromMnemonic(opts: any, walletClient: MeritWalletClient): Promise<MeritWalletClient> {
    try {
      opts.mnemonic = this.normalizeMnemonic(opts.mnemonic);

      walletClient.seedFromMnemonic(opts.mnemonic, {
        network: opts.networkName || ENV.network,
        passphrase: opts.passphrase,
        account: opts.account || 0,
        derivationStrategy: opts.derivationStrategy || 'BIP44',
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
  }
}
