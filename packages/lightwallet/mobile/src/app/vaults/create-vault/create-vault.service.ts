import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { MWCService } from '@merit/common/services/mwc.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { ProfileService } from '@merit/common/services/profile.service';

@Injectable()
export class CreateVaultService {

  private bitcore: any;
  private walletClient: MeritWalletClient;

  private model = {
    vaultName: '',
    whitelist: [],
    amountToDeposit: '0.0',
    amountAvailable: 10000,
    masterKey: null,
    masterKeyMnemonic: '',
    selectedWallet: null
  };

  constructor(private mwcService: MWCService,
              private walletService: WalletService,
              private logger: LoggerService,
              private profileService: ProfileService) {
    this.bitcore = this.mwcService.getBitcore();
  }

  updateData(fields: any): void {
    this.model = _.assign({}, this.model, fields);
    this.walletClient = this.model.selectedWallet;
  }

  getData(): any {
    return this.model;
  }

  async createVault(): Promise<any> {
    const spendKey = this.bitcore.HDPrivateKey.fromString(this.walletClient.credentials.xPrivKey);

    if (_.isEmpty(this.model.whitelist)) {
      const vault = await this.vaultFromModel(spendKey.publicKey, []);
      this.resetModel();

      return vault;
    } else {
      const wallet = this.model.selectedWallet;

      try {
        const vault = await this.vaultFromModel(spendKey.publicKey, this.model.whitelist);

        let scriptReferralOpts = {
          parentAddress: wallet.getRootAddress().toString(),
          pubkey: this.model.masterKey.publicKey.toString(),
          signPrivKey: this.model.masterKey.privateKey,
          address: vault.address.toString(),
          addressType: this.bitcore.Address.ParameterizedPayToScriptHashType, // pubkey address
          network: wallet.network,
        };

        const password = await this.walletService.prepare(wallet);
        await wallet.sendReferral(scriptReferralOpts);
        await wallet.sendInvite(scriptReferralOpts.address, 1, vault.scriptPubKey.toHex());
        const txp = await this.getTxp(vault, false);
        const pubTxp = await this.walletService.publishTx(wallet, txp);
        const signedTxp = await this.walletService.signTx(wallet, pubTxp, password);

        vault.coins.push(signedTxp);
        vault.name = this.model.vaultName;

        await wallet.createVault(vault);
        await this.profileService.addVault({
          id: vault.address,
          copayerId: wallet.credentials.copayerId,
          name: vault.vaultName,
        });

        this.resetModel();
      } catch(err) {
        this.logger.info('Error while creating vault:', err);
        throw err;
      };
    }
  }

  private resetModel() {

    this.model = {
      vaultName: '',
      whitelist: [],
      amountToDeposit: null,
      amountAvailable: 0,
      masterKey: null,
      masterKeyMnemonic: '',
      selectedWallet: null
    }

  }

  private async vaultFromModel(spendPubKey: any, whitelistedAddresses: Array<any>): Promise<any> {
    //currently only supports type 0 which is a whitelisted vault.
    const amount = this.bitcore.Unit.fromMRT(parseFloat(this.model.amountToDeposit)).toMicros();
    const addrs = await Promise.all(whitelistedAddresses.map(async (w: any) => {
      let address;
      if (w.type == 'wallet') {
        address = this.getAllWallets().then((wallets) => {
          let foundWallet = _.find(wallets, { id: w.id });
          return foundWallet.createAddress().then((resp) => {
            return this.bitcore.Address.fromString(resp.address);
          });
        });
      } else {
        address = Promise.resolve(this.bitcore.Address.fromString(w.address));
      }
      return address;
    }));

    return this.walletClient.prepareVault(0, {
      amount: amount,
      whitelist: _.map(addrs, (addr) => addr.toBuffer()),
      masterPubKey: this.model.masterKey.publicKey,
      spendPubKey: spendPubKey,
    });
  }

  private getTxp(vault: any, dryRun: boolean): Promise<any> {
    this.logger.warn('In GetTXP');
    this.logger.warn(vault);
    this.logger.warn(this.model.selectedWallet);
    return this.findFeeLevel(vault.amount).then((feeLevel) => {
      if (vault.amount > Number.MAX_SAFE_INTEGER) {
        return Promise.reject(new Error('The amount is too big')); // Because Javascript
      }

      let txp = {
        outputs: [{
          'toAddress': vault.address.toString(),
          'script': vault.scriptPubKey.toBuffer().toString('hex'),
          'amount': vault.amount
        }],
        addressType: 'PP2SH',
        inputs: null, //Let merit wallet service figure out the inputs based
                      //on the selected wallet.
        feeLevel: feeLevel,
        excludeUnconfirmedUtxos: true,
        dryRun: dryRun,
      };
      return this.walletService.createTx(this.model.selectedWallet, txp);
    });
  }

  private findFeeLevel(amount: number): Promise<any> {
    return Promise.resolve(null);
  }

  private async getAllWallets(): Promise<Array<any>> {
    return await this.profileService.getWallets();
  }
}
