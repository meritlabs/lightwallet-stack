import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Promise } from 'bluebird';

import { Wallet } from 'merit/wallets/wallet.model';
import { WalletService } from 'merit/wallets/wallet.service';
import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'view-send',
  templateUrl: 'send.html',
})
export class SendView {
  private walletsToTransfer: Array<any>; // Eventually array of wallets
  private showTransferCard: boolean;
  private wallets: Array<Wallet>;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private walletService: WalletService
  ) {

  }

  ionViewDidLoad() {
    //do something here
  }

  private updateWalletList(): Promise<any> {
    let walletList:Array<any> = [];
    return new Promise((resolve, reject) => {
      _.each(this.wallets, (w) => {
        walletList.push({
          color: w.color,
          name: w.name, 
          recipientType: 'wallet',
          getAddress: (cb) => {
            this.walletService.getAddress(w, false, cb);
          }
        });
      });
      return resolve(walletList);
    });
  }

  private addressBookToContactList(ab): Promise<any> {
    return new Promise((resolve, reject) => {
      let cl = _.map(ab, function(v, k) {
        var item = {
          name: _.isObject(v) ? v.name : v,
          address: k,
          email: _.isObject(v) ? v.email : null,
          phoneNumber: _.isObject(v) ? v.phoneNumber : null,
          recipientType: 'contact',
          sendMethod: 'address',
          getAddress: function(cb) {
            return cb(null, k);
          },
        };
        item.searchTerm = item.name + item.email + item.phoneNumber;
        return item;
      });
      resolve(cl);
    });
  };


}
