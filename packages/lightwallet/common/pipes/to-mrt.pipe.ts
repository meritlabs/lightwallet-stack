import { Pipe, PipeTransform } from '@angular/core';
import { RateService } from '@merit/common/services/rate.service';

@Pipe({ name: 'toMRT' })
export class ToMrtPipe implements PipeTransform {
  constructor(private rateService: RateService) {}

  transform(micros: number, digitsLimit?: number, hideUnit?: boolean): string {
    const unitStr = hideUnit ? '' : ' MRT';

    let mrt = this.rateService.microsToMrt(micros) || 0;

    if (!digitsLimit) return mrt + unitStr;

    const intLength = mrt.toFixed(0).length;
    let floatLength = digitsLimit - intLength >= 0 ? digitsLimit - intLength : 0;

    return Number(mrt.toFixed(floatLength)) + unitStr;
  }
}
