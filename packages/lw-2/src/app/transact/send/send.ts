import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import * as Promise from 'bluebird';

import { Wallet } from 'merit/wallets/wallet.model';
import { WalletService } from 'merit/wallets/wallet.service';
import { ProfileService } from 'merit/core/profile.service';
import { AddressBookService } from 'merit/shared/address-book/address-book.service';
import { PopupService } from 'merit/core/popup.service';
import { SendService } from 'merit/transact/send/send.service';
import { Logger } from 'merit/core/logger';

import * as _ from 'lodash';
import { MeritWalletClient } from '../../../lib/merit-wallet-client/index';

/**
 * The Send View allows a user to frictionlessly send Merit to contacts
 * without needing to know if they are on the Merit network.
 * We differentiate between the notions of 'original contacts,' which are explicitly created by the user as well as deviceContacts that are already in the addressBook of the device they are using. 
 */
@IonicPage()
@Component({
  selector: 'send-view',
  templateUrl: 'send.html',
})
export class SendView {
  public static readonly CONTACTS_SHOW_LIMIT = 10;
  private walletsToTransfer: Array<any>; // Eventually array of wallets
  private showTransferCard: boolean;
  private wallets: Array<MeritWalletClient>;
  private originalContacts: Array<any>;
  private  deviceContacts: Array<any>; // On your phone or mobile device.
  private currentContactsPage = 0;
  private showMoreContacts: boolean = false;
  private filteredList: Array<any>; 
  private formData: { 
    search: string
  };
  private searchFocus: boolean;
  private hasFunds: boolean;
  private hasOwnedMerit: boolean; 

  
  public hasContacts:boolean; 

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private walletService: WalletService,
    private popupService: PopupService,
    private profileService: ProfileService,
    private logger: Logger,
    private sendService: SendService,
    private addressBookService:AddressBookService,
    private modalCtrl:ModalController
  ) {
    console.log("Hello SendView!!");
    this.hasOwnedMerit = this.profileService.hasOwnedMerit();
    this.formData = { search: '' };
  }

  async ionViewDidLoad() {
    await this.updateHasFunds();
    this.originalContacts = [];
    this.initDeviceContacts();
    this.hasWallets();
  }

  private hasWallets(): boolean {
    return (_.isEmpty(this.wallets) ? false : true);
  }
  
  private updateHasFunds(): Promise<void> {
    return this.profileService.hasFunds().then((hasFunds) => {
      this.hasFunds = hasFunds;
      return Promise.resolve();
    });
  }

  private updateWalletList(): Promise<any> {
    let walletList:Array<any> = [];
    return new Promise((resolve, reject) => {
      _.each(this.wallets, (w) => {
        walletList.push({
          color: w.color,
          name: w.name, 
          recipientType: 'wallet',
          getAddress: () => {
            Promise.resolve(this.walletService.getAddress(w, false));
          }
        });
      });
      return resolve(walletList);
    });
  }

  private addressBookToContactList(ab): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let cl = _.map(ab, function(v:any, k) {
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
    let addressBookList = Promise.promisify(this.addressBookService.list);
    return addressBookList().then((ab) => {
      this.hasContacts = _.isEmpty(ab) ? false : true;

      return this.addressBookToContactList(ab).then((completeContacts) => {
        this.originalContacts = this.originalContacts.concat(completeContacts);
        this.showMoreContacts = completeContacts.length > SendView.CONTACTS_SHOW_LIMIT;
      });
    });
  }

  private initDeviceContacts(): Promise<any> {

    return this.addressBookService.getAllDeviceContacts().then((contacts) => {
      contacts = _.filter(contacts, (contact:any) => {
        return !(_.isEmpty(contact.emails) && _.isEmpty(contact.phoneNumbers));
      });
      this.deviceContacts = _.map(contacts, function(contact:any) {
        var item:any = {
          name: contact.name.formatted,
          emails: _.map(contact.emails, function(o:any) { return o.value; }),
          phoneNumbers: _.map(contact.phoneNumbers, function(o:any) { return o.value; }),
          address: '',
          getAddress: function(cb) { return cb(); }
        };
        item.searchTerm = item.name + _.reduce(
          item.emails.concat(item.phoneNumbers),
          function(l, r) { return l + r; },
          ''
        );
        return item;
      });
 
    });
  } 
  
  private initList():void {
    this.filteredList = [];
    
    // TODO: Resize this in the best-practices ionic3 wya.  
    //this.content.resize();  
    //TODO: Lifecycle tick if needed
  }

  private findMatchingContacts(list, term):Array<any> {
    return _.filter(list, (item) => {
      return _.includes(item.searchTerm.toLowerCase(), term.toLowerCase());
    });
  }

  private contactWithSendMethod(contact, search) {
    var obj = _.clone(contact);

    var email = _.find(obj.emails, function(x:any) {
      return _.includes(x.toLowerCase(), search.toLowerCase());
    });
    if (email) {
      obj.email = email;
      obj.phoneNumber = _.find(obj.phoneNumbers) || '';
      obj.sendMethod = 'email';
      return obj;
    }

    var phoneNumber = _.find(obj.phoneNumbers, function(x:any) {
      return _.includes(x.toLowerCase(), search.toLowerCase());
    });
    if (phoneNumber) {
      obj.phoneNumber = phoneNumber;
      obj.email = _.find(obj.emails) || '';
      obj.sendMethod = 'sms';
      return obj;
    }

    // search matched name, default to sms?
    obj.email = _.find(obj.emails) || '';
    obj.phoneNumber = _.find(obj.phoneNumbers) || '';
    obj.sendMethod = obj.phoneNumber ? 'sms' : 'email';
    return obj;
  }

  private openScanner(): void {
    let modal = this.modalCtrl.create('ImportScanView');
    modal.onDidDismiss((code) => {
        this.findContact(code); 
    });
    modal.present();
  }
 
  private showMore(): void {
    this.currentContactsPage++;
    this.updateWalletList();
  }

  private searchInFocus(): void {
    this.searchFocus = true;
  }

  private searchBlurred(): void {
    if (this.formData.search == null || this.formData.search.length == 0) {
      this.searchFocus = false;
    }
  }

  private findContact(search: string): any {

    // TODO: Improve to be more resilient.
    if(search && search.length > 19) {
      this.sendService.isAddressValid(search).then((isValid) => {
          if (isValid) {
            this.profileService.getWallets()
              .then((wallets) => {
                this.navCtrl.push('SendAmountView', {
                  wallet: wallets[0],
                  sending: true,
                  address: search
                });
              });
        } else {
          this.popupService.ionicAlert('This address has not been invited to the merit network yet!');
        }  
      })
    }

    this.logger.debug("Inside FindContact");
    if (!search || search.length < 1) {
      this.filteredList = [];
      return;
    }

    var result = this.findMatchingContacts(this.originalContacts, search);
    var deviceResult = this.findMatchingContacts(this.deviceContacts, search);
    this.filteredList = result.concat(_.map(deviceResult, (contact) => {
      return this.contactWithSendMethod(contact, search);
    }));  
  }

  private goToAmount(item) {
    item.getAddress(function(err, addr) {
      if (err) {
        //Error is already formated
        return this.popupService.ionicAlert(err);
      }
      if (addr) {
        this.logger.debug('Got toAddress:' + addr + ' | ' + item.name);
      }
      return this.navCtrl.go('amount', {
        recipientType: item.recipientType,
        toAddress: addr,
        toName: item.name,
        toEmail: item.email,
        toPhoneNumber: item.phoneNumber,
        sendMethod: item.sendMethod,
        toColor: item.color
      })
    });
  }

  // TODO: Let's consider a better way to handle these multi-hop transitions.
  private createWallet():void {
    this.navCtrl.push('wallets').then(() => {
      this.navCtrl.push('add-wallet');
    });
  }

  private buyMert(): void {
    this.navCtrl.push('wallets').then(() => {
      this.navCtrl.push('buy-and-sell');
    });
  }

}
