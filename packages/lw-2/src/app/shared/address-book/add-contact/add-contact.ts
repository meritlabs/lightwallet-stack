import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MeritContact, isValidMeritContact, emptyMeritContact } from "merit/shared/address-book/contact/contact.model";
import { AddressBookService } from 'merit/shared/address-book/address-book.service';
import { Logger } from 'merit/core/logger';
import { PopupService } from 'merit/core/popup.service';

// Add Contact Screen
@IonicPage()
@Component({
  selector: 'view-add-contact',
  templateUrl: 'add-contact.html',
})
export class AddContactView {

  public contact:MeritContact;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private addressBookService: AddressBookService,
    private logger: Logger,
    private popupService: PopupService,
  ) {
    this.contact = emptyMeritContact();
  }

  ionViewDidLoad() {
  }

  isValid(): boolean {
    return isValidMeritContact(this.contact);
  }

  openQrScanner() {

  }

  async add() {
    await this.addressBookService.add(this.contact, 'testnet').then((addressBook) => {
      this.logger.warn('added contact, addressBook in storage is:');
      this.logger.warn(addressBook);
      this.navCtrl.pop();
    }).catch((err) => {
      return this.popupService.ionicAlert('Error adding contact:', err.toString());
    });
  }

}
