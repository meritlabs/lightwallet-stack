import { Pipe, PipeTransform } from '@angular/core';
import { ConfigService } from '@merit/common/services/config.service';
import { TxFormatService } from '@merit/common/services/tx-format.service';

@Pipe({ name: 'toFiat' })
export class ToFiatPipe implements PipeTransform {
  private unitCode: string;

  constructor(private configProvider: ConfigService,
              private txFormatProvider: TxFormatService) {
    this.unitCode = this.configProvider.get().wallet.settings.unitCode;
  }

  transform(value: string, satoshis: number): string {
    return this.txFormatProvider.formatAlternativeStr(satoshis);
  }
}
