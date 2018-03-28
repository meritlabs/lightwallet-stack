import { Pipe, PipeTransform } from '@angular/core';
import { RateService } from '@merit/common/services/rate.service';

@Pipe({ name: 'toMRT' })
export class ToMrtPipe implements PipeTransform {
  private unitCode: string;

  constructor(
    private rateService: RateService
  ) {}

  transform(micros: number, digitsLimit?: number): string {

    let mrt = this.rateService.microsToMrt(micros);

    if (!digitsLimit) return mrt+' MRT';

    const intLength = mrt.toFixed(0).length;
    let floatLength  = (digitsLimit - intLength) >= 0 ? (digitsLimit - intLength) : 0;

    return Number(mrt.toFixed(floatLength))+' MRT';
  }
}
