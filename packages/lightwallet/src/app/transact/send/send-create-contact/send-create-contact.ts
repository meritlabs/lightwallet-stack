import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { MeritContact } from 'merit/shared/address-book/merit-contact.model';
import { AddressBookService } from 'merit/shared/address-book/address-book.service';
import { SendMethod } from 'merit/transact/send/send-method.model';
import { SendService } from 'merit/transact/send/send.service';
import { ToastConfig } from "merit/core/toast.config";
import { MeritToastController } from "merit/core/toast.controller";

@IonicPage()
@Component({
  selector: 'view-send-create-contact',
  templateUrl: 'send-create-contact.html',
})
export class SendCreateContactView {

  public contact:MeritContact;
  public amount:number;


  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private addressBook: AddressBookService,
    private sendService: SendService,
    private toastController: MeritToastController
  ) {
  }

  ionViewDidLoad() {
    this.contact = this.navParams.get('contact');
    this.amount = this.navParams.get('amount');
  }

  save() {
    return this.addressBook.add(this.contact, this.contact.meritAddresses[0].address, this.contact.meritAddresses[0].network).then(() => {
      this.navCtrl.remove(2,1);
      this.navCtrl.push('SendVia', {contact: this.contact, amount: this.amount} );
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
    this.contact.meritAddresses.push(meritAddress);
  }

  removeAddress(meritAddress) {
    this.contact.meritAddresses = this.contact.meritAddresses.filter(mAddress => mAddress.address != meritAddress.address);
  }

  isSaveAvailable() {
    return this.contact.name.formatted && this.contact.meritAddresses.length;
  }

}
