import { Injectable } from '@angular/core';
import { MWCService } from '@merit/common/services/mwc.service';
import { FeeService } from '@merit/common/services/fee.service';
import { RateService } from '@merit/common/services/rate.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { ENV } from '@app/env';

@Injectable()
export class SendService {
  constructor(
    private feeService: FeeService,
    private mwcService: MWCService,
    private rateService: RateService
  ) {
  }

  async prepareTxp(wallet: MeritWalletClient, amount, toAddress) {

    if (amount > Number.MAX_SAFE_INTEGER) throw new Error('The amount is too big');

    let txpData:any = {
      outputs: [{ amount, toAddress }],
      inputs: [], // will be defined on MWS side
      feeLevel: this.feeService.getCurrentFeeLevel(),
      excludeUnconfirmedUtxos: false,
      dryRun: true
    };

    if (amount == wallet.status.spendableAmount) {
      delete txpData.outputs[0].amount;
      txpData.sendMax = true;
    }

    let txp = await wallet.createTxProposal(txpData);
    txp.sendMax = txpData.sendMax;
    return txp;  
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

    if (preparedTxp.sendMax || !feeIncluded) {
      txp.outputs[0].amount = preparedTxp.amount;
    } else { 
      txp.outputs[0].amount = preparedTxp.amount - preparedTxp.fee;
      
    }

    return wallet.createTxProposal(txp);

  }

}
