import { Pipe, PipeTransform } from '@angular/core';
import { RateService } from '@merit/common/services/rate.service';

@Pipe({ name: 'toMRT' })
export class ToMrtPipe implements PipeTransform {
  constructor(private rateService: RateService) {}

  transform(micros: number, digitsLimit?: number, hideUnit?: boolean): string {
    let text: string = '';

    if (!micros) {
      text = '0.00';
    } else {
      const mrt: number = this.rateService.microsToMrt(micros);

      if (digitsLimit) {
        text = mrt.toString().slice(0, digitsLimit);
      } else {
        text = mrt.toString();
      }
    }

    return text + (hideUnit ? '' : ' MRT');
  }
}
