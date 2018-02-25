import { Pipe, PipeTransform } from '@angular/core';
import { ConfigService } from '@merit/mobile/app/shared/config.service';
import { TxFormatService } from '@merit/mobile/app/transact/tx-format.service';

@Pipe({ name: 'toUnit' })
export class ToUnitPipe implements PipeTransform {
  private unitCode: string;

  constructor(private configProvider: ConfigService,
              private txFormatProvider: TxFormatService) {
    this.unitCode = this.configProvider.get().wallet.settings.unitCode;
  }

  transform(value: string, satoshis: number): any {
    return this.txFormatProvider.formatAmountStr(satoshis);
  }
}
