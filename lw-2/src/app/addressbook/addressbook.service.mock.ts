import { Injectable } from '@angular/core';
import {Logger} from "merit/core/logger";


@Injectable()
export class AddressbookServiceMock {

  constructor(
    private logger: Logger
  ) {
    this.logger.warn("Using mock service! AddressbookService");
  }


  get(address):Promise<any> {
    return new Promise((resolve, reject) => {
      resolve({});
    });
  }

  list():Promise<any> {
    return new Promise((resolve, reject) => {
      resolve({'123': {name: 'Mock user'}});
    });
  }

  add(entry):Promise<any> {
    return new Promise((resolve, reject) => {
      resolve({});
    });
  }

  remove(address):Promise<any> {
    return new Promise((resolve, reject) => {
      resolve({});
    });
  }

  removeAll():Promise<any> {
    return new Promise((resolve, reject) => {
      resolve({});
    });
  }

}