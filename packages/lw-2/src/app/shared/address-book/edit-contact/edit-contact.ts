import * as _ from 'lodash';
import * as Promise from 'bluebird';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Logger } from 'merit/core/logger';
import { PopupService } from 'merit/core/popup.service';
import { MeritToastController } from "merit/core/toast.controller";
import { ToastConfig } from "merit/core/toast.config";
import { MeritContact } from "merit/shared/address-book/merit-contact.model";
import { Contacts } from '@ionic-native/contacts';
import { MeritContactBuilder } from "merit/shared/address-book/merit-contact.builder";
import { MeritContactService } from  "merit/shared/address-book/merit-contact.service";


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
    private logger: Logger,
    private popupService: PopupService,
    private modalCtrl:ModalController,
    private toastCtrl:MeritToastController,
    private meritContactBuilder:MeritContactBuilder,
    private meritContactService:MeritContactService,
    private contacts:Contacts
  ) {

    this.originalContact = this.navParams.get('contact');

    if (this.originalContact) {
      this.editMode = true;
      this.newContact = this.meritContactBuilder.build(this.originalContact);
    } else {
      this.newContact = this.meritContactBuilder.build();
    }

    if (!this.newContact.meritAddresses.length) {
      this.newContact.meritAddresses.push({network: '', address: ''});
    }
    this.setDefaultValues();

  }

  ionViewDidLoad() {
  }

  private setDefaultValues() {
    if (!this.newContact.emails.length) {
      this.newContact.emails.push({type: 'other', value: ''});
    }
    if (!this.newContact.phoneNumbers.length) {
      this.newContact.phoneNumbers.push({type: 'other', value: ''});
    }
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

    if (!this.newContact.emails[0].value) this.newContact.emails = [];
    if (!this.newContact.phoneNumbers[0].value) this.newContact.phoneNumbers = [];

    if (!this.newContact.isValid()) {
      return this.toastCtrl.create({
        message: 'Contact fields are not valid',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }

    let modify = this.editMode ? this.meritContactService.edit(this.newContact) : this.meritContactService.add(this.newContact);
    modify.then(() => {
      if (this.editMode) {
        this.originalContact.name = this.newContact.name;
        this.originalContact.emails = this.newContact.emails;
        this.originalContact.phoneNumbers = this.newContact.phoneNumbers;
        this.originalContact.urls = this.newContact.urls;
        this.originalContact.meritAddresses= this.newContact.meritAddresses;
      }
      this.navCtrl.pop();
    }).catch((err) => {
      this.setDefaultValues();
      this.logger.warn('Error processing contact', err);
      return this.toastCtrl.create({
        message: 'Error processing contact: ' + err.toString(),
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    });
  }

  isContactValid() {
    return this.newContact.isValid();
  }

  removeEmail(email) {
    this.newContact.emails = this.newContact.emails.filter((e) => e.value != email.value);
  }

  addEmail() {
    console.log('adding email');
    this.newContact.emails.push({type: 'email', value: ''});
  }



  addPhone() {
    this.newContact.phoneNumbers.push({type: 'email', value: ''});
  }

  removePhone(phone) {
    this.newContact.phoneNumbers = this.newContact.phoneNumbers.filter((e) => e.value != phone.value);
  }

}
