import { Injectable } from '@angular/core';
import { BwcService } from 'merit/core/bwc.service';
import { WalletService } from "merit/wallets/wallet.service";
import { Logger } from 'merit/core/logger';
import { MeritWalletClient } from './../../../lib/merit-wallet-client';
import { ProfileService } from 'merit/core/profile.service';
import * as Promise from 'bluebird';
import * as _ from 'lodash';

@Injectable()
export class CreateVaultService {

  private bitcore: any;
  private walletClient: MeritWalletClient;

  private model = {
    vaultName: '',
    whitelist: [],
    amountToDeposit: "0.0",
    amountAvailable: 10000,
    masterKey: null,
    masterKeyMnemonic: '',
    selectedWallet: null};

  constructor(
    private bwcService: BwcService,
    private walletService: WalletService,
    private logger: Logger,
    private profileService: ProfileService,
  ) {
    this.bitcore = this.bwcService.getBitcore();
  }

  updateData(fields: any): void {
    this.model = _.assign({}, this.model, fields);
    this.walletClient = this.model.selectedWallet;
  }

  getData(): any {
    return this.model;
  }

  private resetModel() {

    this.model = {
      vaultName: '',
      whitelist: [],
      amountToDeposit: "0.0",
      amountAvailable: 0,
      masterKey: null,
      masterKeyMnemonic: '',
      selectedWallet: null}
      
  }

  vaultFromModel(spendPubKey: any, whitelistedAddresses: Array<any>): Promise<any> {
    //currently only supports type 0 which is a whitelisted vault.
    const amount = this.bitcore.Unit.fromMRT(parseFloat(this.model.amountToDeposit)).toMicros();
    return Promise.map(whitelistedAddresses, (w: any) => {
      let address; 
      if (w.type == 'wallet') {
        this.bitcore.HDPublicKey.fromString(w.pubKey).publicKey.toAddress();
        address = this.walletClient.createAddress().then((resp) => {
          return this.bitcore.Address.fromString(resp.address);
        });
      } else {
        address = Promise.resolve(this.bitcore.Address.fromString(w.pubKey));
      }
      return address;
    }).then((addrs) => {
      return this.walletClient.prepareVault(0, {
        amount: amount,
        whitelist: _.map(addrs, (addr) => addr.toBuffer()),
        masterPubKey: this.model.masterKey.publicKey,
        spendPubKey: spendPubKey,
      });
    });
  }

  createVault(): Promise<any> {

    if(_.isEmpty(this.model.whitelist)) {

      return this.walletService.getAddress(this.walletClient, false).then((addresses) => {
        const spendPubKey = this.bitcore.PublicKey.fromString(addresses.publicKeys[0]);
        return this.vaultFromModel(spendPubKey, []);
      }).then((vault) => {
        this.resetModel();
        return vault;
      });

    } else {

      let wallet = this.model.selectedWallet;

      let spendPubKey = this.bitcore.HDPublicKey.fromString(wallet.credentials.xPubKey);

      return this.vaultFromModel(spendPubKey, this.model.whitelist).then((vault) => {
        let unlock = {
          unlockCode: wallet.shareCode,
          address: vault.address.toString(),
          network: wallet.credentials.network
        };

        return wallet.unlockAddress(unlock).then((err, resp1) => {
          return this.getTxp(vault, false);
        }).then((txp) => {
          return this.walletService.prepare(wallet).then((password: string) => {
            return { password: password, txp: txp};
          });
        }).then((args: any) => {
          return this.walletService.publishTx(wallet, args.txp).then((pubTxp)=> {
            return { password: args.password, txp: pubTxp};
          });
        }).then((args: any) => {
          return this.walletService.signTx(wallet, args.txp, args.password);
        }).then((signedTxp: any) => {
          vault.coins.push(signedTxp);
          return vault;
        }).then((vault) => {
          vault.name = this.model.vaultName;
          return this.walletClient.createVault(vault);
        }).then((resp) => {
          return this.profileService.addVault({
            id: vault.address,
            copayerId: wallet.credentials.copayerId,
            name: this.model.vaultName,
          });
        }).then(() => {
          this.resetModel();
        });
      }).catch((err) => {
        this.logger.info('Error while creating vault:', err);
        return Promise.reject(err);
      });
    }
  }

  private getTxp(vault: any, dryRun: boolean): Promise<any> {
    this.logger.warn("In GetTXP");
    this.logger.warn(vault);
    this.logger.warn(this.model.selectedWallet);
    return this.findFeeLevel(vault.amount).then((feeLevel) => {
      if (vault.amount > Number.MAX_SAFE_INTEGER) {
        return Promise.reject("The amount is too big.  Because, Javascript.");
      }

      let txp = {
        outputs: [{
          'toAddress': vault.address.toString(),
          'script': vault.scriptPubKey.toBuffer().toString('hex'),
          'amount': vault.amount}],
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

  private findFeeLevel(amount: number) : Promise<any> {
    return Promise.resolve(null);
  }
}
