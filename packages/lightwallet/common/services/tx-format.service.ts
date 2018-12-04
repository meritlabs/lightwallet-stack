import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import { MWCService } from '@merit/common/services/mwc.service';
import { RateService } from '@merit/common/services/rate.service';
import { ConfigService } from '@merit/common/services/config.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { FiatAmount } from '@merit/common/models/fiat-amount';

@Injectable()
export class TxFormatService {
  // TODO: implement configService
  pendingTxProposalsCountForUs: number;

  constructor(
    private mwcService: MWCService,
    private rate: RateService,
    private config: ConfigService,
    private logger: LoggerService,
  ) {
    this.logger.info('Hello TxFormatService Service');
  }

  formatAmount(micros: number, fullPrecision?: boolean): number {
    let settings = this.config.get().wallet.settings;

    if (settings.unitCode == 'sat') return micros;

    //TODO : now only works for english, specify opts to change thousand separator and decimal separator
    let opts = {
      fullPrecision: !!fullPrecision,
    };
    return this.mwcService.getUtils().formatAmount(micros, settings.unitCode, opts);
  }

  // Todo: Improve
  formatAmountStr(micros: number): string {
    if (isNaN(micros)) return;
    return String(this.formatAmount(micros));
  }

  async toFiat(micros: number, code: string): Promise<string> {
    if (isNaN(micros)) return;
    let v1 = this.rate.fromMicrosToFiat(micros, code);
    if (!v1) return null;
    return v1.toFixed(2);
  }

  toFiatStr(micros: number, code: string): Promise<string> {
    return this.toFiat(micros, code).then(fiatAmount => {
      return new FiatAmount(parseFloat(fiatAmount)).amountStr;
    });
  }

  formatToUSD(micros: number): string {
    if (isNaN(micros)) return;
    let v1 = this.rate.fromMicrosToFiat(micros, 'USD');
    if (!v1) return null;
    return v1.toFixed(2);
  }

  formatAlternativeStr(micros: number) {
    if (isNaN(micros)) return;
    let settings = this.config.get().wallet.settings;

    let v1 = parseFloat(this.rate.fromMicrosToFiat(micros, settings.alternativeIsoCode).toFixed(2));
    if (!v1) return null;
    let v1FormatFiat = new FiatAmount(v1);
    if (!v1FormatFiat) return null;

    let currencySymbolPrefix: string;
    let currencySymbolSuffix: string;

    // TODO: Break into function and cover all currencies.
    switch (settings.alternativeIsoCode) {
      case 'USD':
        currencySymbolPrefix = '$';
        break;
      case 'EUR':
        currencySymbolPrefix = '€';
        break;
      default:
        currencySymbolPrefix = '';
        break;
    }

    // TODO: Break into function and cover all currencies.
    switch (settings.alternativeIsoCode) {
      default:
        currencySymbolSuffix = '';
        break;
    }

    return currencySymbolPrefix + v1FormatFiat.amount + ' ' + currencySymbolSuffix;
  }

  async processTx(tx: any): Promise<any> {
    if (!tx || tx.action == 'invalid') return tx;

    // New transaction output format
    if (tx.outputs && tx.outputs.length) {
      let outputsNr = tx.outputs.length;

      if (tx.action != 'received') {
        if (outputsNr > 1) {
          tx.recipientCount = outputsNr;
          tx.hasMultiplesOutputs = true;
        }
      }
      tx.toAddress = tx.outputs[0].toAddress;
    }

    tx.amountStr = this.formatAmountStr(tx.amount);
    tx.alternativeAmountStr = await this.formatAlternativeStr(tx.amount);
    tx.feeStr = this.formatAmountStr(tx.fee || tx.fees);

    if (tx.amountStr) {
      tx.amountValueStr = tx.amountStr.split(' ')[0];
      tx.amountUnitStr = tx.amountStr.split(' ')[1];
    }

    return tx;
  }

  async formatPendingTxps(txps): Promise<any> {
    this.pendingTxProposalsCountForUs = 0;
    let now = Math.floor(Date.now() / 1000);

    const pTxps = await Promise.all(
      txps.map(async (tx: any) => {
        // no future transactions...
        if (tx.createdOn > now) tx.createdOn = now;

        // TODO: We should not call any services here.  Data should be passed in.
        tx.wallet = { copayerId: 'yepNope' };

        if (!tx.wallet) {
          this.logger.info('no wallet at txp?');
          return;
        }

        const pTx = await this.processTx(tx);

        let action: any = _.find(pTx.actions, {
          copayerId: pTx.wallet.copayerId,
        });

        if (!action && pTx.status == 'pending') {
          pTx.pendingForUs = true;
        }

        if (action && action.type == 'accept') {
          pTx.statusForUs = 'accepted';
        } else if (action && action.type == 'reject') {
          pTx.statusForUs = 'rejected';
        } else {
          pTx.statusForUs = 'pending';
        }

        if (!pTx.deleteLockTime) pTx.canBeRemoved = true;

        return pTx;
      }),
    );

    this.logger.warn('What are the TXPs after promise all?');
    this.logger.warn(pTxps);
    return pTxps;
  }

  parseAmount(amount: any, currency: string) {
    let settings = this.config.get()['wallet']['settings']; // TODO

    let satToBtc = 1 / 100000000;
    let microsToMrt = 1 / 100000000;
    let unitToMicro = settings.unitToMicro;
    let amountUnitStr;
    let amountMicros;
    let alternativeIsoCode = settings.alternativeIsoCode;

    // If fiat currency
    if (currency != 'bits' && currency != 'MRT' && currency != 'micros') {
      amountUnitStr = amount + ' ' + currency;
      amountMicros = this.rate.fromFiatToMicros(amount, currency).toFixed(0);
    } else if (currency == 'micros') {
      amountMicros = amount;
      amountUnitStr = this.formatAmountStr(amountMicros);
      // convert micros to MRT
      amount = (amountMicros * microsToMrt).toFixed(8);
      currency = 'MRT';
    } else {
      amountMicros = parseInt((amount * unitToMicro).toFixed(0));
      amountUnitStr = this.formatAmountStr(amountMicros);
      // convert unit to MRT
      amount = (amountMicros * microsToMrt).toFixed(8);
      currency = 'MRT';
    }
    return {
      amount: amount,
      currency: currency,
      alternativeIsoCode: alternativeIsoCode,
      amountMicros: amountMicros,
      amountUnitStr: amountUnitStr,
    };
  }

  satToUnit(amount: any) {
    let settings = this.config.get()['wallet']['settings'];

    let unitToMicro = settings.unitToMicro;
    let satToUnit = 1 / unitToMicro;
    let unitDecimals = settings.unitDecimals;
    return parseFloat((amount * satToUnit).toFixed(unitDecimals));
  }
}
