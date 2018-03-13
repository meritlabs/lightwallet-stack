import * as _ from 'lodash';
import { UNITS } from '@merit/common/utils/constants';


function clipDecimals(number, decimals) {
  const x = number.toString().split('.');
  const d = (x[1] || '0').substring(0, decimals);
  return parseFloat(x[0] + '.' + d);
}

function addSeparators(nStr: string, thousands: string, decimal: string, minDecimals: number): string {
  nStr = nStr.replace('.', decimal);
  const x = nStr.split(decimal);
  let [x0, x1] = x;

  x1 = _.dropRightWhile(x1, (n, i) => n == '0' && i >= minDecimals).join('');
  const x2 = x.length > 1 ? decimal + x1 : '';

  x0 = x0.replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
  return x0 + x2;
}

export const formatAmount = (micros: number, unit: string, opts: any = {}): string => {
  const u = UNITS[unit],
    precision: string = opts.fullPrecision ? 'full' : 'short',
    amount: string = clipDecimals((micros / u.toMicros), u[precision].maxDecimals).toFixed(u[precision].maxDecimals);
  return addSeparators(amount, opts.thousandsSeparator || ',', opts.decimalSeparator || '.', u[precision].minDecimals);
};
