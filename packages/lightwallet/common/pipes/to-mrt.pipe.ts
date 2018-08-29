import { Pipe, PipeTransform } from '@angular/core';
import { microsToMrt } from '@merit/common/utils/format';

@Pipe({ name: 'toMRT' })
export class ToMrtPipe implements PipeTransform {
  transform(micros: number, digitsLimit?: number, hideUnit?: boolean): string {

    const unitStr = (hideUnit? '' : ' MRT');

    let mrt = microsToMrt(micros) || 0;

    if (!digitsLimit) return mrt+unitStr;

    const intLength = mrt.toFixed(0).length;
    let floatLength  = (digitsLimit - intLength) >= 0 ? (digitsLimit - intLength) : 0;

    return Number(mrt.toFixed(floatLength))+unitStr;

  }
}
