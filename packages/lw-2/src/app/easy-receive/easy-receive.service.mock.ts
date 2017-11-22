import { Injectable } from '@angular/core';
import {EasyReceipt} from "./easy-receipt.model";
import { MeritWalletClient } from 'src/lib/merit-wallet-client';

@Injectable()
export class EasyReceiveServiceMock {

  public extractReceiptFromParams(params:any):Promise<EasyReceipt> {
    return new Promise((resolve, reject) => {
      resolve(new EasyReceipt({}));
    });
  }

  public storePendingReceipt(receipt:EasyReceipt):Promise<EasyReceipt> {
    return new Promise((resolve, reject) => {
      resolve(receipt);
    });
  }

  public getPendingReceipt():Promise<EasyReceipt> {
    return new Promise((resolve, reject) => {
      resolve(new EasyReceipt({senderName: 'Mock user', checkPassword: true}));
    })
  }

  public acceptEasyReceipt(receipt:EasyReceipt, wallet:MeritWalletClient, input:number, destinationAddress:any):Promise<EasyReceipt> {
    return new Promise((resolve, reject) => {
      resolve(receipt);
    })
  }

  public rejectEasyReceipt(receipt:EasyReceipt):Promise<any> {
    return new Promise((resolve, reject) => {
      resolve('ok');
    })
  }



}