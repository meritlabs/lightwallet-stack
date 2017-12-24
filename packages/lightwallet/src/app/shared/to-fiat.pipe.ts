import { Pipe, PipeTransform } from '@angular/core';
import { ConfigService } from 'merit/shared/config.service';
import { TxFormatService } from 'merit/transact/tx-format.service';
import * as Promise from 'bluebird';

@Pipe({ name: 'toFiat' })
export class ToFiatPipe implements PipeTransform {
  private unitCode: string;

  constructor(
    private configProvider: ConfigService,
    private txFormatProvider: TxFormatService
  ) { 
    this.unitCode = this.configProvider.get().wallet.settings.unitCode;
  }
  transform(value: string, satoshis: number): Promise<string> {
    return this.txFormatProvider.formatAlternativeStr(satoshis).then((altSr:string) => {
      return Promise.resolve(altSr);
    });
  }
}
