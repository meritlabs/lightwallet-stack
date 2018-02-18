import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { SendService } from 'merit/transact/send/send.service';
import { ToastConfig } from 'merit/core/toast.config';
import { MeritToastController } from 'merit/core/toast.controller';
import { IMeritAddress, MeritContact } from '../../../../models/merit-contact';
import { ContactsProvider } from '../../../../providers/contacts/contacts';

import { ENV } from '@app/env';

@IonicPage()
@Component({
  selector: 'view-send-create-contact',
  templateUrl: 'send-create-contact.html',
})
export class SendCreateContactView {

  public contact: MeritContact;
  public amount: number;
  public newAddress: string;

  constructor(private navParams: NavParams,
              private contactsService: ContactsProvider,
              private sendService: SendService,
              private toastController: MeritToastController,
              private viewCtrl: ViewController) {
    let address = this.navParams.get('address');
    this.contact = new MeritContact();
    this.contact.meritAddresses.push(address);
  }

  save() {
    return this.contactsService.add(this.contact, this.contact.meritAddresses[0].address, ENV.network)
      .then(() => {
        this.viewCtrl.dismiss(this.contact);
      });
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  async addAddress(address: string) {
    if (address.charAt(0) === '@') address = address.substr(1);
    if (this.contact.meritAddresses.findIndex(m => m.address == address || m.alias == address) > -1) {
      return this.toastController.create({
        message: 'Address is already bound to this contact',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }

    const info = await this.sendService.getAddressInfoIfValid(address);

    if (!info) {
      return this.toastController.create({
        message: 'Address is invalid or not invited to blockchain yet',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }

    const meritAddress: IMeritAddress = {
      network: ENV.network,
      address: info.address,
      alias: info.alias
    };

    this.contact.meritAddresses.push(meritAddress);
    this.newAddress = '';
  }

  removeAddress(meritAddress) {
    this.contact.meritAddresses = this.contact.meritAddresses.filter(mAddress => mAddress.address != meritAddress.address);
  }

  isSaveAvailable() {
    return this.contact.name.formatted && this.contact.meritAddresses.length;
  }

}
