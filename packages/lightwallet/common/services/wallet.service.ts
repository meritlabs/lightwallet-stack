import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
import { MWCService } from '@merit/common/services/mwc.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { MnemonicService } from "@merit/common/services/mnemonic.service";
import { LoggerService } from '@merit/common/services/logger.service';
import { PersistenceService } from '@merit/common/services/persistence.service';

@Injectable()
export class WalletService {

  client: MeritWalletClient;

  constructor(
    private mwcService: MWCService,
    private profileService: ProfileService,
    private mnemonicService: MnemonicService,
    private persistenceService: PersistenceService,
    private logger: LoggerService
  ) {
  }

  encrypt(wallet: MeritWalletClient, password: string): Promise<any> {
    wallet.encryptPrivateKey(password, {});
    return this.profileService.updateWallet(wallet);
  };

  decrypt(wallet: MeritWalletClient, password: string) {
    return wallet.decryptPrivateKey(password);
  }

  createDefaultWallet(parentAddress: string, alias: string): Promise<MeritWalletClient> {
    return this.createWallet({ parentAddress, alias });
  }

  async createWallet(opts: any): Promise<MeritWalletClient> {

    let wallet = await this.seedWallet(opts);
    opts.name = opts.name || 'Personal Wallet';
    opts.m = opts.m || 1;
    opts.n = opts.n || 1;
    opts.myName = opts.myName || 'me';
    await wallet.createWallet(opts.name, opts.myName, opts.m, opts.n, {
      network: ENV.network,
      singleAddress: opts.singleAddress,
      walletPrivKey: opts.walletPrivKey,
      parentAddress: opts.parentAddress,
      alias: opts.alias
    });

    await this.profileService.addWallet(wallet);
    return wallet;

  }

  /**
   * Create wallet credentials from existing mnemonic/key, or random mnemonic phrase
   */
  seedWallet(opts: any): Promise<MeritWalletClient>  {
    let wallet = this.mwcService.getClient(null, opts);

    if (opts.mnemonic) {
      try {
        // TODO: Type the walletClient
        return this.mnemonicService.seedFromMnemonic(opts, wallet);
      } catch (ex) {
        this.logger.info(ex);
        throw new Error('Could not create: Invalid wallet recovery phrase'); // TODO getTextCatalog
      }
    } else if (opts.extendedPrivateKey) {
      try {
        wallet.seedFromExtendedPrivateKey(opts.extendedPrivateKey, {
          network: ENV.network,
          account: opts.account || 0,
          derivationStrategy: opts.derivationStrategy || 'BIP44'
        });
        return wallet;
      } catch (ex) {
        this.logger.warn(ex);
        throw new Error('Could not create using the specified extended private key'); // TODO GetTextCatalog
      }
    } else if (opts.extendedPublicKey) {
      try {
        wallet.seedFromExtendedPublicKey(opts.extendedPublicKey, opts.externalSource, opts.entropySource, {
          account: opts.account || 0,
          derivationStrategy: opts.derivationStrategy || 'BIP44'
        });
        wallet.credentials.hwInfo = opts.hwInfo;
        return wallet;
      } catch (ex) {
        this.logger.warn('Creating wallet from Extended Key Arg:', ex, opts);
        throw new Error('Could not create using the specified extended key'); // TODO GetTextCatalog
      }
    } else {
      wallet.seedFromRandomWithMnemonic({
        network: ENV.network,
        passphrase: opts.passphrase,
        account: 0
      });
      return wallet;
    }
  }

  async setHiddenBalanceOption(wallet: MeritWalletClient, hideBalance: boolean): Promise<void> {
    wallet.balanceHidden = hideBalance;
    await this.persistenceService.setHideBalanceFlag(wallet.id, String(hideBalance));
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


  async importExtendedPrivateKey(xPrivKey: string, opts: any): Promise<any> {

    const walletClient = this.mwcService.getClient(null, opts);

    try {
      await walletClient.importFromExtendedPrivateKey(xPrivKey, opts);
      return this.profileService.addWallet(walletClient);
    } catch (err) {
      this.logger.warn(err);
      throw new Error(err.text || 'Error while importing wallet');
    }
  }

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

  async importWallet(data: string, opts: any): Promise<MeritWalletClient> {
    try {

      let walletClient = this.mwcService.getClient(null, opts);

      let c = JSON.parse(data);

      if (c.xPrivKey && c.xPrivKeyEncrypted) {
        this.logger.warn('Found both encrypted and decrypted key. Deleting the encrypted version');
        delete c.xPrivKeyEncrypted;
        delete c.mnemonicEncrypted;
      }

      walletClient.import(JSON.stringify(c));

      return this.profileService.addWallet(walletClient);

    } catch (e) {
      this.logger.warn(e);
      throw new Error('Could not import. Check input file and spending password');
    }
  }

}
