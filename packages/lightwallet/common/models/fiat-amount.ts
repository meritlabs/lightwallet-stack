import * as _ from 'lodash';

export class FiatAmount {
  formats: {
    CURRENCY_SYM: string;
    DECIMAL_SEP: string;
    GROUP_SEP: string;
  };
  amount: number;
  amountStr: string;

  constructor(amount: number) {
    this.formats = {
      CURRENCY_SYM: '$',
      DECIMAL_SEP: '.',
      GROUP_SEP: ',',
    };
    this.amount = this.formatFiatAmount(amount);
    this.amountStr = this.formatAmountStr(amount);
  }

  // Inserts commas and decimals to formal an amount.
  // Example: 123456789.12 -> 123,456,789.12
  formatFiatAmount(amount: number) {
    let value: any,
      sep: any,
      group: any,
      intValue: any,
      floatValue: any,
      finalValue: any,
      fractionSize = 2;

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
    let formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      // the default value for minimumFractionDigits depends on the currency
      // and is usually already 2
    });

    return formatter.format(this.formatFiatAmount(amount));
  }
}
