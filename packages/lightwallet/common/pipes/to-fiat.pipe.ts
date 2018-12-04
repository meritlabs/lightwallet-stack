import { Pipe, PipeTransform } from '@angular/core';
import { TxFormatService } from '@merit/common/services/tx-format.service';

@Pipe({ name: 'toFiat' })
export class ToFiatPipe implements PipeTransform {
  constructor(private txFormatProvider: TxFormatService) {}

  transform(value: string, micros: number): string {
    return this.txFormatProvider.formatAlternativeStr(micros);
  }
}
