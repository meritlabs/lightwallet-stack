import { Pipe, PipeTransform } from '@angular/core';
import { ConfigService } from '@merit/common/services/config.service';
import { TxFormatService } from '@merit/common/services/tx-format.service';

@Pipe({ name: 'toUnit' })
export class ToUnitPipe implements PipeTransform {
  private unitCode: string;

  constructor(private configProvider: ConfigService, private txFormatProvider: TxFormatService) {
    this.unitCode = this.configProvider.get().wallet.settings.unitCode;
  }

  transform(value: string): string {
    return this.txFormatProvider.formatAmountStr(Number(value));
  }
}
