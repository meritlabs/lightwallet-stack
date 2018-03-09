import * as _ from 'lodash';
import { UNITS } from '@merit/common/utils/constants';


function clipDecimals(number, decimals) {
  let x = number.toString().split('.');
  let d = (x[1] || '0').substring(0, decimals);
  return parseFloat(x[0] + '.' + d);
};

function addSeparators(nStr, thousands, decimal, minDecimals) {
  nStr = nStr.replace('.', decimal);
  let x = nStr.split(decimal);
  let x0 = x[0];
  let x1 = x[1];

  x1 = _.dropRightWhile(x1, function(n, i) {
    return n == '0' && i >= minDecimals;
  }).join('');
  let x2 = x.length > 1 ? decimal + x1 : '';

  x0 = x0.replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
  return x0 + x2;
};

export const  formatAmount = function(micros: number, unit: string, opts: any) {
  opts = opts || {};

  let u = UNITS[unit];
  let precision = opts.fullPrecision ? 'full' : 'short';
  let amount = clipDecimals((micros / u.toMicros), u[precision].maxDecimals).toFixed(u[precision].maxDecimals);
  return addSeparators(amount, opts.thousandsSeparator || ',', opts.decimalSeparator || '.', u[precision].minDecimals);
};