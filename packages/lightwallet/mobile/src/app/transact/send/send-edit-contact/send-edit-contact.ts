import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import { ENV } from '@app/env';
import { IMeritAddress, MeritContact } from '@merit/common/models/merit-contact';
import { ContactsService } from '@merit/common/services/contacts.service';
import { cleanAddress, isAlias } from '@merit/common/utils/addresses';
import { ToastControllerService, IMeritToastConfig } from '@merit/common/services/toast-controller.service';
import { AddressService } from '@merit/common/services/address.service';

@IonicPage()
@Component({
  selector: 'view-send-edit-contact',
  templateUrl: 'send-edit-contact.html',
})
export class SendEditContactView {
  contact: MeritContact;
  newAddress: string = '';

  private actions: Array<{ type: string; mAddress: IMeritAddress }> = []; //logging all actions to properly modify addressbook

  private readonly TYPE_REMOVE = 'remove';
  private readonly TYPE_ADD = 'add';

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private contactsService: ContactsService,
    private toastController: ToastControllerService,
    private addressService: AddressService,
    private alertCtrl: AlertController,
  ) {
    this.contact = this.navParams.get('contact');
  }

  removeAddress(meritAddress) {
    this.actions.push({ type: this.TYPE_REMOVE, mAddress: meritAddress });
    this.actions = this.actions.filter(action => {
      //removing fresh added address
      return action.type != this.TYPE_ADD || action.mAddress.address != meritAddress.address;
    });
    this.contact.meritAddresses = this.contact.meritAddresses.filter(mAddress => {
      return mAddress.address != meritAddress.address;
    });
  }

  async addAddress(address) {
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

    this.actions.push({ type: this.TYPE_ADD, mAddress: meritAddress });
    this.contact.meritAddresses.push(meritAddress);
    this.newAddress = '';
  }

  async save() {
    const removalPromises = [];
    this.actions.forEach(action => {
      if (action.type == this.TYPE_REMOVE) {
        removalPromises.push(this.contactsService.remove(action.mAddress.address, action.mAddress.network));
      }
    });

    //removing all entities with existing addresses key
    this.contact.meritAddresses.forEach(mAddress => {
      removalPromises.push(this.contactsService.remove(mAddress.address, mAddress.network));
    });

    await Promise.all(removalPromises);

    if (_.isEmpty(this.contact.meritAddresses)) {
      this.navCtrl.remove(2, 1);
      return this.navCtrl.pop();
    } else {
      await this.contactsService.add(this.contact, this.contact.meritAddresses[0].address, ENV.network);
      return this.navCtrl.pop();
    }
  }

  // we are able to delete merit contacts and edit name property, instead of contacts in device address book
  isMeritContact() {
    return !this.contact.phoneNumbers.length && !this.contact.emails.length;
  }

  isSaveAvailable() {
    return this.contact.name.formatted && this.contact.meritAddresses.length;
  }

  deleteContact() {
    let remove = () => {
      this.contact.meritAddresses.forEach(m => {
        this.removeAddress(m);
      });
      return this.save();
    };

    this.alertCtrl
      .create({
        title: `Are you sure want to delete this contact?`,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {},
          },
          {
            text: 'Delete',
            handler: () => {
              remove();
            },
          },
        ],
      })
      .present();
  }
}
