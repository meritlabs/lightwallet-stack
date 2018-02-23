import { Injectable } from '@angular/core';
import { IDisplayWallet } from "merit/../models/display-wallet";

import { Logger } from 'merit/core/logger';
import { WalletService } from 'merit/wallets/wallet.service';
import { ProfileService } from 'merit/core/profile.service';
import { BwcService } from 'merit/core/bwc.service';
import { RateService } from "merit/transact/rate.service";

export interface  ICreateVaultData {
  vaultName: string;
  wallet: IDisplayWallet;
  whiteList: Array<IDisplayWallet>;
  amount: number;
  masterKey: {key: any, phrase: string};
}

@Injectable()
export class CreateVaultService {

  private Bitcore;
  
  constructor(
    private logger: Logger,
    private walletService: WalletService,
    private profileService: ProfileService,
    private rateService: RateService,
    bwcService: BwcService
  ) {
    this.Bitcore = bwcService.getBitcore();
  }

  async create(data: ICreateVaultData) {

      await this.checkData(data);

      const vault:any = await data.wallet.client.prepareVault(0, {
        amount: this.rateService.mrtToMicro(data.amount),
        whitelist: data.whiteList.map(w => w.client.getRootAddress().toBuffer()),
        masterPubKey: data.masterKey.key.publicKey,
        spendPubKey: this.Bitcore.HDPrivateKey.fromString(data.wallet.client.credentials.xPrivKey).publicKey,
      });

      let scriptReferralOpts = {
        parentAddress: data.wallet.client.getRootAddress().toString(),
        pubkey: data.masterKey.key.publicKey.toString(),
        signPrivKey: data.masterKey.key.privateKey,
        address: vault.address.toString(),
        addressType: this.Bitcore.Address.ParameterizedPayToScriptHashType, // pubkey address
        network: data.wallet.client.network
      };

      const password = await this.walletService.prepare(data.wallet.client);
      await data.wallet.client.sendReferral(scriptReferralOpts);
      await data.wallet.client.sendInvite(scriptReferralOpts.address, 1, vault.scriptPubKey.toHex());
      const txp = await this.getTxp(vault, data.wallet);
      const pubTxp = await this.walletService.publishTx(data.wallet.client, txp);
      const signedTxp = await this.walletService.signTx(data.wallet.client, pubTxp, password);

      vault.coins.push(signedTxp);
      vault.name = data.vaultName;

      await data.wallet.client.createVault(vault);
      await this.profileService.addVault({
        id: vault.address,
        copayerId: data.wallet.client.credentials.copayerId,
        name: vault.vaultName,
      });

  }

  private async checkData(data) {
    if (
      !data.vaultName
      || !data.wallet
      || !data.whiteList
      || !data.whiteList.length
      || !data.amount
      || !data.masterKey || !data.masterKey.key || !data.masterKey.phrase
    ) {
      this.logger.warn('Incorrect data', data);
      throw new Error('Incorrect data');
    }

    const status = await this.walletService.getStatus(data.wallet.client, {force: true});

    if (!status.availableInvites) {
      throw new Error("You don't have any active invites that you can use to create a vault");
    }
    if (data.amount > status.spendableAmount) {
      throw new Error("Wallet balance is less than vault balance");
    }
    
    return true;
  }

  private async getTxp(vault: any, wallet: IDisplayWallet): Promise<any> {
    let feeLevel = 'normal'; //todo temp

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
      dryRun: false,
    };
    return this.walletService.createTx(wallet.client, txp);
  }

}