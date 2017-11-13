import { Injectable } from '@angular/core';

@Injectable()
export class TxFormatServiceMock {

  parseAmount(coin: string, amount: any, currency: string):Promise<string> {
    return new Promise((resolve, reject) => {
      resolve(`${amount} ${currency}`);
    });
  }

}