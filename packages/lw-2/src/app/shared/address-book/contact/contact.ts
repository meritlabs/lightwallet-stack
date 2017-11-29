import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { MeritContact } from 'merit/shared/address-book/contact/contact.model';
import { AddressBookService } from 'merit/shared/address-book/address-book.service';
import { ProfileService } from "merit/core/profile.service";

@IonicPage()
@Component({
  selector: 'view-contact',
  templateUrl: 'contact.html',
})
export class ContactView {

  contact:MeritContact;
  wallets:Array<any>;

  constructor(
    private navCtrl: NavController,
    private navParams:NavParams,
    private addressBookService: AddressBookService,
    private alertCtrl:AlertController,
    private profileService:ProfileService
  ) {
    this.contact = this.navParams.get('contact');
  }

  ionViewDidLoad() {
    this.getWallets();
  }

  private getWallets():Promise<any> {

    if (this.wallets) {
      return Promise.resolve(this.wallets);
    } else {
      return new Promise((resolve, reject) => {
        return this.profileService.getWallets().then((wallets) => {
          this.wallets = wallets;
          return resolve(wallets);
        });
      });
    }

  }

  remove() {

    this.alertCtrl.create({
      title: 'Remove contact',
      message: 'Are you sure want to delete contact?',
      buttons: [
        {text: 'Cancel', role: 'cancel', handler: () => {}},
        {text: 'Ok', handler: (data) => {
            this.addressBookService.remove(this.contact.meritAddress, 'testnet').then(() => {
              this.navCtrl.pop();
            });
          }
        }
      ]
    }).present();

  }

  toSendAmount() {
    this.getWallets().then((wallets) => {
      this.navCtrl.push('SendAmountView', {
        sending: true,
        recipient: this.contact
      });
    });
  }

  toEditContact() {
    this.navCtrl.push('EditContactView', {contact: this.contact})
  }


}
