import * as Promise from 'bluebird';
import { Injectable } from '@angular/core';
import { Logger } from "merit/core/logger";


@Injectable()
export class RateServiceMock  {

  constructor(
    private logger:Logger
  ) {
    this.logger.warn("Using mock service: RateServiceMock");
  }



  // todo how to use chain parameter?
  fromFiat(meritAmount:number, currencyCode:string, chain:string):Promise<number> {
      return Promise.resolve(123.5423489723049823);
  }

}