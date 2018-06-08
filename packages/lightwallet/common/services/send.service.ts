import { Injectable } from '@angular/core';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { EasySend } from '@merit/common/models/easy-send';
import { MeritContact } from '@merit/common/models/merit-contact';
import { ISendMethod, SendMethodType } from '@merit/common/models/send-method';
import { FeeService } from '@merit/common/services/fee.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { clone } from 'lodash';
import { EasySendService } from '@merit/common/services/easy-send.service';
import { Address } from 'bitcore-lib';
import { accessWallet } from "./wallet.service";
import { AlertController } from 'ionic-angular';
import { getEasySendURL } from '@merit/common/models/easy-send';

export interface ISendTxData {
  amount?: number; // micros
  totalAmount?: number; // micros
  totalAmount?: number; // micros
  fee?: number; // micros
  feeIncluded?: boolean;
  easyFee?: number,
  password?: string;
  recipient?: {
    label?: string;
    name?: string;
    emails?: Array<{ value: string }>;
    phoneNumbers?: Array<{ value: string }>;
  } | MeritContact;
  sendMethod?: ISendMethod;
  txp?: any;
  easySend?: EasySend;
  easySendUrl?: string;
  wallet?: MeritWalletClient;
  referralsToSign?: Array<any>;
  timeout?: number;
}

@Injectable()
export class SendService {
  constructor(private feeService: FeeService,
              private walletService: WalletService,
              private loggerService: LoggerService,
              private easySendService: EasySendService,
              private alertCtrl: AlertController,
              private persistenceService: PersistenceService2) {}

  async prepareTxp(wallet: MeritWalletClient, amount: number, toAddress: string) {
    if (amount > Number.MAX_SAFE_INTEGER) throw new Error('The amount is too big');

    let txpData: any = {
      outputs: [{ amount, toAddress }],
      inputs: [], // will be defined on MWS side
      feeLevel: this.feeService.getCurrentFeeLevel(),
      excludeUnconfirmedUtxos: false,
      dryRun: true
    };

    if (amount == wallet.balance.spendableAmount) {
      delete txpData.outputs[0].amount;
      txpData.sendMax = true;
    }

    let txp = await wallet.createTxProposal(txpData);
    txp.sendMax = txpData.sendMax;
    return txp;
  }

  finalizeTxp(wallet: MeritWalletClient, preparedTxp: any, feeIncluded: boolean = true) {
    let txp: any = {
      outputs: preparedTxp.outputs,
      inputs: preparedTxp.inputs,
      fee: preparedTxp.fee,
      excludeUnconfirmedUtxos: false,
      dryRun: false,
      addressType: preparedTxp.addressType
    };

    if (preparedTxp.sendMax || !feeIncluded) {
      txp.outputs[0].amount = preparedTxp.amount;
    } else {
      txp.outputs[0].amount = preparedTxp.amount - preparedTxp.fee;
    }

    return wallet.createTxProposal(txp);
  }

  @accessWallet
  async send(wallet: MeritWalletClient, txData: ISendTxData) {

    if (txData.sendMethod.type == SendMethodType.Easy)  {
      const easySend = await this.easySendService.createEasySendScriptHash(wallet); //todo password removed
      txData.easySend = easySend;
      txData.txp = await this.easySendService.prepareTxp(wallet, txData.amount, easySend);
      txData.easySendUrl = getEasySendURL(easySend);
      txData.referralsToSign = [easySend.scriptReferralOpts];
    } else {
      txData.txp = await this.prepareTxp(wallet, txData.amount, txData.toAddress);
    }
    txData.txp = await this.finalizeTxp(wallet, txData.txp, Boolean(txData.feeIncluded));

    if (txData.referralsToSign) {
      for (let referral of txData.referralsToSign) {
        await wallet.sendReferral(referral);
        await this.walletService.sendInvite(wallet, referral.address);
      }
    }

    await this.approveTx(txData.txp, wallet);

    if (txData.sendMethod.type === SendMethodType.Easy) {
      await this.persistenceService.addEasySend(clone(txData.easySend));
    }

    return txData;
  }

  private async approveTx(txp: any, wallet: MeritWalletClient) {
    if (!wallet.canSign() && !wallet.isPrivKeyExternal()) {
      this.loggerService.info('No signing proposal: No private key');
      await this.walletService.onlyPublish(wallet, txp);
    } else {
      await this.walletService.publishAndSign(wallet, txp);
    }
  }


  async estimateFee(wallet, amount, isEasySend, toAddress?) {

    if (isEasySend) {
      const easySend = await this.easySendService.bulidScript(wallet);
      const address = Address(easySend.script.getAddressInfo()).toString();
      console.log(wallet, amount,  address, 'address');
      const txp = await this.prepareTxp(wallet, amount, address);
      const sendFee = txp.fee;
      const receiveFee = await this.feeService.getEasyReceiveFee();
      return sendFee + receiveFee;
    } else {
      let txp = await this.prepareTxp(wallet, amount, toAddress);
      return txp.fee;
    }

  }


}
