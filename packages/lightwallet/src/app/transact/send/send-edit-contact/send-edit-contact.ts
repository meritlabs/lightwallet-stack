import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { MeritContact, IMeritAddress } from 'merit/shared/address-book/merit-contact.model';
import { AddressBookService } from 'merit/shared/address-book/address-book.service';
import { ToastConfig } from "merit/core/toast.config";
import { MeritToastController } from "merit/core/toast.controller";
import { SendService } from 'merit/transact/send/send.service';
import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'view-send-edit-contact',
  templateUrl: 'send-edit-contact.html',
})
export class SendEditContactView {

  public contact:MeritContact;
  public newAddress:string = '';

  public actions:Array<{type:string, mAddress:IMeritAddress}>; //logging all actions to properly modify addressbook

  private readonly TYPE_REMOVE = 'remove';
  private readonly TYPE_ADD = 'add';

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private addressBook: AddressBookService,
    private toastController: MeritToastController,
    private sendService: SendService,
    private alertCtrl: AlertController
  ) {
  }

  ionViewDidLoad() {
    this.contact = this.navParams.get('contact');
  }

  removeAddress(meritAddress) {
    this.actions.push({type: this.TYPE_REMOVE, mAddress: meritAddress});
    this.actions = this.actions.filter((action) => { //removing fresh added address
      return (action.type != this.TYPE_ADD || action.mAddress.address != meritAddress.address);
    });
    this.contact.meritAddresses = this.contact.meritAddresses.filter(mAddress => {
      return (mAddress.address != meritAddress.address);
    });
  }

  addAddress(address) {
    if (!this.sendService.isAddressValid(address)) {
      return this.toastController.create({
        message: 'Address is invalid or not invited to blockchain yet',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }

    let network = this.sendService.getAddressNetwork(address);
    let meritAddress = {address, network};
    this.actions.push({type: this.TYPE_ADD, mAddress: meritAddress});
    this.contact.meritAddresses.push(meritAddress);
  }

  save() {

    let removalPromises = [];
    let addressKey = null;
    this.actions.forEach((action) => {
      if (action.type == this.TYPE_REMOVE) {
        removalPromises.push(this.addressBook.remove(action.mAddress.address, action.mAddress.network));
      }
    });
    //removing all entities with existing addresses key
    this.contact.meritAddresses.forEach((mAddress) => {
      removalPromises.push(this.addressBook.remove(mAddress.address, mAddress.network));
    });
    return Promise.all(removalPromises).then(() => {
      if (_.isEmpty(this.contact.meritAddresses)) {
        return this.navCtrl.pop();
      } else {
        return this.addressBook.add(this.contact, this.contact.meritAddresses[0].address, this.contact.meritAddresses[0].network).then(() => {
          return this.navCtrl.pop();
        });
      }
    });
  }

  // we are able to delete merit contacts and edit name property, instead of contacts in device address book
  isMeritContact() {
    return (!this.contact.phoneNumbers.length && this.contact.emails.length);
  }

  isSaveAvailable() {
    return this.contact.name.formatted && this.contact.meritAddresses.length;
  }

  deleteContact() {
    this.contact.meritAddresses = [];
    return this.save(); 
  }

}
