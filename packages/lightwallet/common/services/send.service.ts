import { Injectable } from '@angular/core';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { EasySend } from '@merit/common/models/easy-send';
import { MeritContact } from '@merit/common/models/merit-contact';
import { ISendMethod } from '@merit/common/models/send-method';
import { FeeService } from '@merit/common/services/fee.service';

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
  constructor(private feeService: FeeService) {}

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
}
