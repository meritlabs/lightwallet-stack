import { Injectable } from '@angular/core';
import { BwcService } from 'merit/core/bwc.service';
import { WalletService } from "merit/wallets/wallet.service";
import { Logger } from 'merit/core/logger';
import { MeritWalletClient, IMeritWalletClient} from './../../../../../merit-wallet-client';
import * as _ from 'lodash';

@Injectable()
export class CreateVaultService {

  private bitcore: any;
  private walletClient: IMeritWalletClient;

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
    private logger: Logger) {

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
      amountAvailable: 10000,
      masterKey: null,
      masterKeyMnemonic: '',
      selectedWallet: null}
      
  }

  private vaultFromModel(spendPubKey: any) {
    //currently only supports type 0 which is a whitelisted vault.
    const amount = this.bitcore.Unit.fromMRT(parseFloat(this.model.amountToDeposit)).toSatoshis();
    const whitelist = _.map(this.model.whitelist, (w) => { 
      let key = this.bitcore.HDPublicKey.fromString(w.pubKey);
      return key.toBuffer();
    });

    return this.walletClient.prepareVault(0, {
      amount: amount,
      whitelist: whitelist,
      masterPubKey: this.model.masterKey.publicKey,
      spendPubKey: spendPubKey
    });
  }

  createVault(): Promise<any> {

    if(_.isEmpty(this.model.whitelist)) {

      return this.walletService.getAddress(this.walletClient, false).then((addresses) => {
        let spendPubKey = this.bitcore.PublicKey.fromString(addresses.publicKeys[0]);
        let vault = this.vaultFromModel(spendPubKey);

        this.resetModel();
        return vault;
      });

    } else {

      let wallet = this.model.selectedWallet;

      let spendPubKey = this.bitcore.HDPublicKey.fromString(wallet.credentials.xPubKey);
      let vault = this.vaultFromModel(spendPubKey);

      let unlock = {
        unlockCode: wallet.shareCode,
        address: vault.address.toString(),
        network: wallet.credentials.network
      };

      return wallet.unlockAddress(unlock).then((err1, res1) => {
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
        return this.walletClient.createVault(vault);
      }).then((resp) => {
        this.resetModel();
      });
    }
  }

  private getTxp(vault, dryRun: boolean): Promise<any> {
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
        message: vault.name,
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
