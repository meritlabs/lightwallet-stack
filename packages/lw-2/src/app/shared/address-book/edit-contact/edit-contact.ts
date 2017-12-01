import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
//import { MeritContact, isValidMeritContact, emptyMeritContact } from "merit/shared/address-book/contact/contact.model";
import { AddressBookService } from 'merit/shared/address-book/address-book.service';
import { Logger } from 'merit/core/logger';
import { PopupService } from 'merit/core/popup.service';
import { MeritToastController } from "merit/core/toast.controller";
import { ToastConfig } from "merit/core/toast.config";
import { MeritContact } from "merit/shared/address-book/merit-contact.model";


@IonicPage()
@Component({
  selector: 'view-edit-contact',
  templateUrl: 'edit-contact.html',
})
export class EditContactView {

  public originalContact:MeritContact;
  public editMode:boolean;
  public newContact:MeritContact;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private addressBookService: AddressBookService,
    private logger: Logger,
    private popupService: PopupService,
    private modalCtrl:ModalController,
    private toastCtrl:MeritToastController
  ) {

    //this.originalContact = this.navParams.get('contact');
    // editing available for those contacts only, that were added by user, so they have meritAddress
    // if we work with contact from device, we are not editing it, but adding new MeritContact entity
    //this.editMode = this.originalContact && this.originalContact.meritAddress;
    //this.newContact = this.originalContact ? Object.assign({}, this.originalContact) : emptyMeritContact();
    this.newContact = this.navParams.get('contact');
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

    if (!this.newContact.isValid()) {
      return this.toastCtrl.create({
        message: 'Contact fields are not valid',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }

    this.editContact();
    //if (this.editMode) {
    //  this.editContact();
    //} else {
    //  //this.addContact();
    //}

  }

  addContact() {
    //return this.addressBookService.add(this.newContact, 'testnet').then((addressBook) => {
    //  this.logger.warn('added contact, addressBook in storage is:');
    //  this.logger.warn(addressBook);
    //  this.navCtrl.pop();
    //}).catch((err) => {
    //  return this.toastCtrl.create({
    //    message: 'Error adding contact: '+err.toString(),
    //    cssClass: ToastConfig.CLASS_ERROR
    //  }).present();
    //});
  }

  editContact() {

    if (this.newContact.storeOnDevice) {
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
      contact.save();
      this.navCtrl.push('AddressBookView');
    }

    //return this.addressBookService.remove(this.originalContact.meritAddress, 'testnet').then(() => {
    //  return this.addressBookService.add(this.newContact, 'testnet').then((addressBook) => {
    //    this.logger.warn('added contact, addressBook in storage is:');
    //    this.logger.warn(addressBook);
    //    this.originalContact = this.newContact;
    //    this.navCtrl.push('AddressBookView');
    //  });
    //}).catch((err) => {
    //  return this.toastCtrl.create({
    //    message: 'Error editing contact: '+err.toString(),
    //    cssClass: ToastConfig.CLASS_ERROR
    //  }).present();
    //});

  }

}
