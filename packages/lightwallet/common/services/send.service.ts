import { Injectable } from '@angular/core';
import { MWCService } from '@merit/common/services/mwc.service';
import { FeeService } from '@merit/common/services/fee.service';
import { RateService } from '@merit/common/services/rate.service';
import { ENV } from '@app/env';
import * as Bitcore from 'bitcore-lib';
import {MeritWalletClient} from "../merit-wallet-client/index";

@Injectable()
export class SendService {
  constructor(
    private feeService: FeeService,
    private mwcService: MWCService,
    private rateService: RateService
  ) {
  }


  prepareTxp(wallet: MeritWalletClient, amount, toAddress) {

    if (amount > Number.MAX_SAFE_INTEGER) throw new Error('The amount is too big');

    let txp:any = {
      outputs: [{ amount, toAddress }],
      inputs: [], // will be defined on MWS side
      feeLevel: this.feeService.getCurrentFeeLevel(),
      excludeUnconfirmedUtxos: false,
      dryRun: true
    };

    if (amount == wallet.status.spendableAmount) {
      delete txp.outputs[0].amount;
      txp.sendMax = true;
    }

    return wallet.createTxProposal(txp);

  }

  finalizeTxp(wallet, preparedTxp, feeIncluded) {

    let txp:any = {
      outputs: preparedTxp.outputs,
      inputs: preparedTxp.inputs,
      fee: preparedTxp.fee,
      excludeUnconfirmedUtxos: false,
      dryRun: false,
      addressType: preparedTxp.addressType
    };

    if (preparedTxp.sendMax || feeIncluded) txp.outputs[0].amount = preparedTxp.outputs[0].amount - preparedTxp.fee;

    return wallet.createTxProposal(txp);

  }

}
