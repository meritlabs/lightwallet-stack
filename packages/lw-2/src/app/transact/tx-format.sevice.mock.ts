import * as Promise from 'bluebird';
import { Injectable } from '@angular/core';

@Injectable()
export class TxFormatServiceMock {

  parseAmount(coin: string, amount: any, currency: string):Promise<string> {
    return Promise.resolve(`${amount} ${currency}`);
  }

}