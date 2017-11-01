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
  private originalContacts: Array<any>;
  private deviceContacts: Array<any>; // On your phone or mobile device.
  private currentContactsPage = 0;
  private showMoreContacts: boolean = false;
  public static readonly CONTACTS_SHOW_LIMIT = 10;


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
        let item:any = {
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

  private initContactList(): Promise<any> {
    let addressBookList = Promise.promisify(this.addressBookService.list());
    return addressBookList.then((ab) => {
      this.hasContacts = _.isEmpty(ab) ? false : true;

      let completeContacts = addressBookToContactList(ab);
      this.originalContacts = this.originalContacts.concat(completeContacts);
      this.showMoreContacts = completeContacts.length > CONTACTS_SHOW_LIMIT;
    });
  }

  private initDeviceContacts(): Promise<any> {
    let getDeviceContacts = Promise.promisify(this.addressBookService.getAllDeviceContacts);

    return getDeviceContacts.then((contacts) => {
      contacts = _.filter(contacts, (contact) => {
        return !(_.isEmpty(contact.emails) && _.isEmpty(contact.phoneNumbers));
      });
      this.deviceContacts = this.deviceContacts.concat(_.map(contacts, function(contact) {
        var item = {
          name: contact.name.formatted,
          emails: _.map(contact.emails, function(o) { return o.value; }),
          phoneNumbers: _.map(contact.phoneNumbers, function(o) { return o.value; }),
          address: '',
          getAddress: function(cb) { return cb(); }
        };
        item.searchTerm = item.name + _.reduce(
          item.emails.concat(item.phoneNumbers),
          function(l, r) { return l + r; },
          ''
        );
        return item;
      }));
    });
  }  

}
