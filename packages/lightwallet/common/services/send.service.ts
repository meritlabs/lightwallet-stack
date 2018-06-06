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
import { Events } from 'ionic-angular/util/events';

export interface ISendTxData {
  amount?: number; // micros
  totalAmount?: number; // micros
  feeAmount?: number; // micros
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
              private logger: LoggerService,
              private events: Events,
              private persistenceService: PersistenceService2
  ) {}

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

  async send(txData: ISendTxData, wallet: MeritWalletClient) {
    txData.txp = await this.finalizeTxp(wallet, txData.txp, Boolean(txData.feeIncluded));

    if (txData.referralsToSign) {
      for (let referral of txData.referralsToSign) {
        await wallet.sendReferral(referral);
        await wallet.sendInvite(referral.address);
      }
    }

    await this.approveTx(txData.txp, wallet);

    if (txData.sendMethod.type === SendMethodType.Easy) {
      await this.persistenceService.addEasySend(clone(txData.easySend));
    }
  }

  public async publishAndSign( txp: any, wallet: MeritWalletClient): Promise<any> {

    if (txp.status != 'pending') {
      txp =  await wallet.publishTxProposal({ txp });
    } else {
      this.logger.info('TXP IS PENDING');
    }
    return this.signAndBroadcast(wallet, txp);
  }

  private async approveTx(txp: any, wallet: MeritWalletClient) {
    if (!wallet.canSign() && !wallet.isPrivKeyExternal()) {
      this.logger.info('No signing proposal: No private key');
      await this.publishTxp(txp, wallet);
    } else {
      await this.publishAndSign(txp, wallet);
    }
  }


  private async publishTxp(txp: any, wallet: MeritWalletClient) {
    const publishedTxp = await wallet.publishTxProposal({ txp });
    this.events.publish('Local:Tx:Publish', publishedTxp);
  }


  private async signAndBroadcast(wallet: MeritWalletClient, publishedTxp: any): Promise<any> {

    const signedTxp = await wallet.signTxProposal(publishedTxp, null);

    if (signedTxp.status == 'accepted') {
      const broadcastedTxp = await  wallet.broadcastTxProposal(signedTxp);
      this.events.publish('Local:Tx:Broadcast', broadcastedTxp);
      return broadcastedTxp;
    } else {
      this.events.publish('Local:Tx:Signed', signedTxp);
      return signedTxp;
    }
  }


}
