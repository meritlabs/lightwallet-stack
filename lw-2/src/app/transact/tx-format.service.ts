import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { BwcService } from 'merit/core/bwc.service';
import { RateService } from 'merit/transact/rate.service';
import { ConfigService } from 'merit/shared/config.service';
import { FiatAmount } from 'merit/shared/fiat-amount.model';
import * as _ from "lodash";

/* 
  Ideally, this service gets loaded when it is needed.
*/ 
@Injectable()
export class TxFormatService {

  // TODO: implement configService
  public pendingTxProposalsCountForUs: number

  constructor(
    private bwc: BwcService,
    private rate: RateService,
    private config: ConfigService
  ) {
    console.log('Hello TxFormatService Service');
  }

  formatAmount(satoshis: number, fullPrecision?: boolean) {
    let settings = this.config.get().wallet.settings;

    if (settings.unitCode == 'sat') return satoshis;

    //TODO : now only works for english, specify opts to change thousand separator and decimal separator
    var opts = {
      fullPrecision: !!fullPrecision
    };
    return this.bwc.getUtils().formatAmount(satoshis, settings.unitCode, opts);
  }

  formatAmountStr(satoshis: number) {
    if (isNaN(satoshis)) return;
    return this.formatAmount(satoshis) + ' MRT';
  }

  toFiat(satoshis: number, code: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (isNaN(satoshis)) resolve();
      var v1;
      v1 = this.rate.toFiat(satoshis, code);
      if (!v1) resolve(null);
      resolve(v1.toFixed(2));
    });
  }

  formatToUSD(satoshis: number) {
    return new Promise((resolve, reject) => {
      var v1;
      if (isNaN(satoshis)) resolve();
      v1 = this.rate.toFiat(satoshis, 'USD');
      if (!v1) resolve(null);
      resolve(v1.toFixed(2));
    });
  };

  formatAlternativeStr(satoshis: number) {
    return new Promise((resolve, reject) => {
      if (isNaN(satoshis)) resolve();
      let settings = this.config.get().wallet.settings;

      var v1 = parseFloat((this.rate.toFiat(satoshis, settings.alternativeIsoCode)).toFixed(2));
      var v1FormatFiat = new FiatAmount(v1);
      if (!v1FormatFiat) resolve(null);

      resolve(v1FormatFiat + ' ' + settings.alternativeIsoCode);
    });
  };

  processTx(tx: any) {
    if (!tx || tx.action == 'invalid')
      return tx;

    // New transaction output format
    if (tx.outputs && tx.outputs.length) {

      var outputsNr = tx.outputs.length;

      if (tx.action != 'received') {
        if (outputsNr > 1) {
          tx.recipientCount = outputsNr;
          tx.hasMultiplesOutputs = true;
        }
        tx.amount = _.reduce(tx.outputs, function (total: any, o: any) {
          o.amountStr = this.formatAmountStr(o.amount);
          o.alternativeAmountStr = this.formatAlternativeStr(o.amount);
          return total + o.amount;
        }, 0);
      }
      tx.toAddress = tx.outputs[0].toAddress;
    }

    tx.amountStr = this.formatAmountStr(tx.amount);
    tx.alternativeAmountStr = this.formatAlternativeStr(tx.amount);
    tx.feeStr = this.formatAmountStr(tx.fee || tx.fees);

    if (tx.amountStr) {
      tx.amountValueStr = tx.amountStr.split(' ')[0];
      tx.amountUnitStr = tx.amountStr.split(' ')[1];
    }

    return tx;
  };

  formatPendingTxps(txps) {
    this.pendingTxProposalsCountForUs = 0;
    var now = Math.floor(Date.now() / 1000);

    /* To test multiple outputs...
    var txp = {
      message: 'test multi-output',
      fee: 1000,
      createdOn: new Date() / 1000,
      outputs: []
    };
    function addOutput(n) {
      txp.outputs.push({
        amount: 600,
        toAddress: '2N8bhEwbKtMvR2jqMRcTCQqzHP6zXGToXcK',
        message: 'output #' + (Number(n) + 1)
      });
    };
    lodash.times(150, addOutput);
    txps.push(txp);
    */

    _.each(txps, function (tx) {

      // no future transactions...
      if (tx.createdOn > now)
        tx.createdOn = now;

    
      // TODO: We should not call any services here.  Data should be passed in.
      tx.wallet = {copayerId: "Yep"};


      if (!tx.wallet) {
        console.log("no wallet at txp?");
        return;
      }

      tx = this.processTx(tx);

      var action: any = _.find(tx.actions, {
        copayerId: tx.wallet.copayerId
      });

      if (!action && tx.status == 'pending') {
        tx.pendingForUs = true;
      }

      if (action && action.type == 'accept') {
        tx.statusForUs = 'accepted';
      } else if (action && action.type == 'reject') {
        tx.statusForUs = 'rejected';
      } else {
        tx.statusForUs = 'pending';
      }

      if (!tx.deleteLockTime)
        tx.canBeRemoved = true;
    });

    return txps;
  };

  parseAmount(amount: any, currency: string) {
    let settings = this.config.get()['wallet']['settings']; // TODO

    var satToBtc = 1 / 100000000;
    var unitToSatoshi = settings.unitToSatoshi;
    var amountUnitStr;
    var amountSat;
    var alternativeIsoCode = settings.alternativeIsoCode;

    // If fiat currency
    if (currency != 'BCH' && currency != 'BTC' && currency != 'sat') {
      amountUnitStr = new FiatAmount(amount) + ' ' + currency;
      amountSat = this.rate.fromFiat(amount, currency).toFixed(0);
    } else if (currency == 'sat') {
      amountSat = amount;
      amountUnitStr = this.formatAmountStr(amountSat);
      // convert sat to BTC or BCH
      amount = (amountSat * satToBtc).toFixed(8);
      currency = 'MRT';
    } else {
      amountSat = parseInt((amount * unitToSatoshi).toFixed(0));
      amountUnitStr = this.formatAmountStr(amountSat);
      // convert unit to BTC or BCH
      amount = (amountSat * satToBtc).toFixed(8);
      currency = 'MRT';
    }

    return {
      amount: amount,
      currency: currency,
      alternativeIsoCode: alternativeIsoCode,
      amountSat: amountSat,
      amountUnitStr: amountUnitStr
    };
  };

  satToUnit(amount: any) {
    let settings = this.config.get()['wallet']['settings']; // TODO

    var unitToSatoshi = settings.unitToSatoshi;
    var satToUnit = 1 / unitToSatoshi;
    var unitDecimals = settings.unitDecimals;
    return parseFloat((amount * satToUnit).toFixed(unitDecimals));
  };

}
