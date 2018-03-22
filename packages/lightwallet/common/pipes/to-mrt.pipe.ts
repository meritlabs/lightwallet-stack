import { Pipe, PipeTransform } from '@angular/core';
import { RateService } from '@merit/common/services/rate.service';

@Pipe({ name: 'toMRT' })
export class ToMrtPipe implements PipeTransform {
  constructor(private rateService: RateService) {}

  transform(micros: number, digitsLimit?: number, hideUnit?: boolean): string {
    let text: string = '';

    const mrt = this.rateService.microsToMrt(micros);

    if (digitsLimit) {
      const intLength = mrt.toFixed(0).length;
      let floatLength = (digitsLimit - intLength) >= 0 ? (digitsLimit - intLength) : 0;

      text = mrt.toFixed(floatLength);
    } else {
      text = String(mrt);
    }

    return text + (hideUnit ? '' : ' MRT');
  }
}
