import { Injectable } from '@angular/core';
import {EasyReceipt} from "./easy-receipt.model";
import { MeritWalletClient } from 'src/lib/merit-wallet-client';
import * as Promise from 'bluebird';


@Injectable()
export class EasyReceiveService {

  // todo it's a mock now!!
  public extractReceiptFromParams(params:any):Promise<EasyReceipt> {
    return new Promise((resolve, reject) => {
      resolve(new EasyReceipt({}));
    });
  }

  // todo it's a mock now!!
  public storePendingReceipt(receipt:EasyReceipt):Promise<EasyReceipt> {
    return new Promise((resolve, reject) => {
      resolve(receipt);
    });
  }

  // todo it's a mock now!!
  public getPendingReceipt():Promise<EasyReceipt> {

    //get and validate in blockchain

    return new Promise((resolve, reject) => {
      //resolve(new EasyReceipt({senderName: 'Mock user'}));
      resolve();
    })
  }

  //todo it's a mock now!
  public acceptEasyReceipt(receipt:EasyReceipt, wallet:MeritWalletClient, input:number, destinationAddress:any):Promise<EasyReceipt> {
    return new Promise((resolve, reject) => {
      resolve(receipt);
    })
  }

  // todo it's a mock now!!
  public rejectEasyReceipt(receipt:EasyReceipt):Promise<any> {
    return new Promise((resolve, reject) => {
      resolve('ok');
    })
  }
}