import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { ENV } from '@app/env';
import { IMeritAddress, MeritContact } from '@merit/common/models/merit-contact';
import { cleanAddress, isAlias } from '@merit/common/utils/addresses';
import { ContactsService } from '@merit/common/services/contacts.service';
import { AddressService } from '@merit/common/services/address.service';
import { ToastControllerService, IMeritToastConfig } from '@merit/common/services/toast-controller.service';

@IonicPage()
@Component({
  selector: 'view-send-create-contact',
  templateUrl: 'send-create-contact.html',
})
export class SendCreateContactView {
  contact: MeritContact;
  amount: number;
  newAddress: string;

  constructor(
    navParams: NavParams,
    private contactsService: ContactsService,
    private addressService: AddressService,
    private toastController: ToastControllerService,
    private viewCtrl: ViewController,
  ) {
    this.contact = new MeritContact();
    this.contact.meritAddresses.push(navParams.get('address'));
  }

  save() {
    return this.contactsService.add(this.contact, this.contact.meritAddresses[0].address, ENV.network).then(() => {
      this.viewCtrl.dismiss(this.contact);
    });
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  async addAddress(address: string) {
    address = cleanAddress(address);
    if (isAlias(address)) address = address.slice(1);
    if (this.contact.meritAddresses.findIndex(m => m.address == address || m.alias == address) > -1) {
      return this.toastController.error('Address is already bound to this contact');
    }

    const info = await this.addressService.getAddressInfoIfValid(address);

    if (!info) {
      return this.toastController.error('Address is invalid or not invited to blockchain yet');
    }

    const meritAddress: IMeritAddress = {
      network: ENV.network,
      address: info.address,
      alias: info.alias,
    };

    this.contact.meritAddresses.push(meritAddress);
    this.newAddress = '';
  }

  removeAddress(meritAddress) {
    this.contact.meritAddresses = this.contact.meritAddresses.filter(
      mAddress => mAddress.address != meritAddress.address,
    );
  }

  isSaveAvailable() {
    return this.contact.name.formatted && this.contact.meritAddresses.length;
  }
}
