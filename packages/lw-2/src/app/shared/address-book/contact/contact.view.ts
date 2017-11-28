import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MeritContact } from 'merit/shared/address-book/contact/contact.model';
import { AddressBookService } from 'merit/shared/address-book/address-book.service';

// Contacts view (component)
@IonicPage()
@Component({
  selector: 'view-contact',
  templateUrl: 'contact.html',
})
export class ContactView {

  contact:MeritContact;

  constructor(
    private navCtrl: NavController,
    private navParams:NavParams,
    private addressBookService: AddressBookService,
  ) {
    this.navParams.get('contact');
  }

  ionViewDidLoad() {
    //do something here
  }

  remove() {
    this.addressBookService.remove(this.contact.meritAddress, 'testnet').then(() => {
      this.navCtrl.pop();
    });
  }


}
