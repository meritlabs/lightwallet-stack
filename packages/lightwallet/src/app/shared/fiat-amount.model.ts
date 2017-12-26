import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as _ from "lodash";

@Injectable()
export class FiatAmount {

  public formats: {
      CURRENCY_SYM: string,
      DECIMAL_SEP: string,
      GROUP_SEP: string
  };
  public amount: number;
  public amountStr: string;

  constructor(amount: number) {
    this.formats = {
      CURRENCY_SYM: "$",
      DECIMAL_SEP: ".",
      GROUP_SEP: ","
    }
    this.amount = this.formatFiatAmount(amount);
    this.amountStr = this.formatAmountStr(amount);
  }

  // Inserts commas and decimals to formal an amount.
  // Example: 123456789.12 -> 123,456,789.12
  formatFiatAmount(amount: number) {
    var value: any;
    var sep: any;
    var group: any;
    var intValue: any;
    var floatValue: any;
    var finalValue: any;

    var fractionSize = 2;
    value = _.round(amount, fractionSize).toString();
    sep = value.indexOf(this.formats.DECIMAL_SEP);
    group = value.indexOf(this.formats.GROUP_SEP);

    if (amount >= 0) {
      if (group > 0) {
        if (sep < 0) {
          return value;
        }
        intValue = value.substring(0, sep);
        floatValue = parseFloat(value.substring(sep));
        floatValue = floatValue.toFixed(2);
        floatValue = floatValue.toString().substring(1);
        finalValue = intValue + floatValue;
        return finalValue;
      } else {
        value = parseFloat(value);
        return value.toFixed(2);
      }
    }
    return 0;
  }

  formatAmountStr(amount: number): string {
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      // the default value for minimumFractionDigits depends on the currency
      // and is usually already 2
    });

    return formatter.format(this.formatFiatAmount(amount));
  }

}