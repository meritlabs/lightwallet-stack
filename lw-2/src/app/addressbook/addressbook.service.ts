import { Injectable } from '@angular/core';
import {Logger} from "merit/core/logger";


@Injectable()
export class AddressbookService {

  constructor(
    private logger: Logger
  ) {
  }

  //todo working as a mock now
  get(address):Promise<any> {
    return new Promise((resolve, reject) => {
      resolve({});
    });
  }

  //todo working as a mock now
  list():Promise<any> {
    return new Promise((resolve, reject) => {
      resolve({});
    });
  }

  //todo working as a mock now
  add(entry):Promise<any> {
    return new Promise((resolve, reject) => {
      resolve({});
    });
  }

  //todo working as a mock now
  remove(address):Promise<any> {
    return new Promise((resolve, reject) => {
      resolve({});
    });
  }

  //todo working as a mock now
  removeAll():Promise<any> {
    return new Promise((resolve, reject) => {
      resolve({});
    });
  }


}