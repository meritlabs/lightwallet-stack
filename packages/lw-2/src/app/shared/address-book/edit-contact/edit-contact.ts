import * as _ from 'lodash';
import * as Promise from 'bluebird';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AddressBookService } from 'merit/shared/address-book/address-book.service';
import { Logger } from 'merit/core/logger';
import { PopupService } from 'merit/core/popup.service';
import { MeritToastController } from "merit/core/toast.controller";
import { ToastConfig } from "merit/core/toast.config";
import { MeritContact } from "merit/shared/address-book/merit-contact.model";
import { Contacts } from '@ionic-native/contacts';


@IonicPage()
@Component({
  selector: 'view-edit-contact',
  templateUrl: 'edit-contact.html',
})
export class EditContactView {

  public originalContact:MeritContact;
  public editMode:boolean;
  public newContact:MeritContact;
  public email: any;
  public phoneNumber: any;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private addressBookService: AddressBookService,
    private logger: Logger,
    private popupService: PopupService,
    private modalCtrl:ModalController,
    private toastCtrl:MeritToastController,
    private contacts:Contacts
  ) {

    this.originalContact = this.navParams.get('contact');

    if (this.originalContact) {
      this.editMode = true;
      this.newContact = MeritContact.fromAddressBookContact(JSON.parse(JSON.stringify(this.originalContact)));
    } else {
      this.newContact = new MeritContact();
    }

    if (!this.newContact.meritAddresses.length) {
      this.newContact.meritAddresses.push({network: 'testnet', address: ''});
    }
  }

  ionViewDidLoad() {
  }

  openScanner() {
    let modal = this.modalCtrl.create('ImportScanView');
    modal.onDidDismiss((address) => {
      if (address) {
        if (address.indexOf('merit:') == 0) address = address.slice(6);
        this.newContact.meritAddresses[0].address = address;
      }
    });
    modal.present();
  }

  save() {

    this.newContact.meritAddresses.forEach((address) => {
      if (address.address.indexOf('merit:') == 0) address.address = address.address.slice(6);
    });

    this.newContact.emails = this.newContact.emails.filter((email) => { return (email.value != '') } );
    this.newContact.phoneNumbers = this.newContact.phoneNumbers.filter((number) => { return (number.value != '') } );

    if (!this.newContact.isValid()) {
      return this.toastCtrl.create({
        message: 'Contact fields are not valid',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }

    let modify = this.editMode ? this.editContact() : this.addContact();
    modify.then(() => {
      this.originalContact = this.newContact;
      this.navCtrl.pop();
    }).catch((err) => {
      return this.toastCtrl.create({
        message: 'Error processing contact: ' + err.toString(),
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    });

  }

  addContact(): Promise<any> {

      if (this.newContact.storeOnDevice) {
        let contact = this.contacts.create();
        contact.name = this.newContact.name;
        contact.emails = this.newContact.emails;
        contact.phoneNumbers = this.newContact.phoneNumbers;
        contact.urls = this.newContact.urls;
        return Promise.resolve(contact.save());
      } else {
        return this.addressBookService.add(this.newContact, 'testnet').then((addressBook) => {
          this.logger.warn('added contact, addressBook in storage is:');
          this.logger.warn(addressBook);
        });
      }

  }

  editContact() {

    if (this.newContact.storeOnDevice) {
      return this.addressBookService.remove(this.originalContact.meritAddresses[0].address, 'testnet').then(() => {
          let contact = this.newContact.nativeModel;
          contact.phoneNumbers = this.newContact.phoneNumbers;
          contact.emails = this.newContact.emails;
          contact.urls = this.newContact.urls.filter((url) => {
            if (url.type.indexOf('merit') == 0) return false;
          });
          this.newContact.meritAddresses.forEach((address) => {
            //  //todo add network
            contact.urls.push({value: 'merit:'+address.address+':testnet', type: 'other', pref: false});
          });
          return contact.save();
      });
    } else {
      return this.addressBookService.remove(this.originalContact.meritAddresses[0].address, 'testnet').then(() => {
        return this.addressBookService.add(this.newContact, 'testnet');
      })
    }

  }

  isContactValid() {
    return this.newContact.isValid();
  }

  getEmails() {
    if (this.newContact.emails.length) {
      return this.newContact.emails;
    } else {
      return [{type: 'email', value: ''}];
    }
  }

  removeEmail() {
    this.newContact.emails = this.newContact.emails.filter((e) => e.value != this.email.value);
  }

  addEmail() {
    console.log('adding email');
    this.newContact.emails.push({type: 'email', value: ''});
  }

  getPhones() {
    if (this.newContact.phoneNumbers.length) {
      return this.newContact.phoneNumbers;
    } else {
      return [{type: 'email', value: ''}];
    }
  }

  addPhone() {
    this.newContact.phoneNumbers.push({type: 'email', value: ''});
  }

  removePhone() {
    this.newContact.phoneNumbers = this.newContact.phoneNumbers.filter((e) => e.value != this.phoneNumber.value);
  }

}
