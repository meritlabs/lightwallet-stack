import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ToastConfig } from "merit/core/toast.config";
import { MeritToastController } from "merit/core/toast.controller";
import { SendService } from 'merit/transact/send/send.service';
import * as _ from 'lodash';
import { ContactsProvider } from '../../../../providers/contacts/contacts';
import { IMeritAddress, MeritContact } from '../../../../models/merit-contact';
import { ENV } from '@app/env';

@IonicPage()
@Component({
  selector: 'view-send-edit-contact',
  templateUrl: 'send-edit-contact.html',
})
export class SendEditContactView {

  public contact:MeritContact;
  public newAddress:string = '';

  public actions:Array<{type:string, mAddress:IMeritAddress}> = []; //logging all actions to properly modify addressbook

  private readonly TYPE_REMOVE = 'remove';
  private readonly TYPE_ADD = 'add';

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private contactsService: ContactsProvider,
    private toastController: MeritToastController,
    private sendService: SendService,
    private alertCtrl: AlertController
  ) {
    this.contact = this.navParams.get('contact');
  }

  ionViewDidLoad() {
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

    let network = ENV.network;
    let meritAddress = {address, network};
    this.actions.push({type: this.TYPE_ADD, mAddress: meritAddress});
    this.contact.meritAddresses.push(meritAddress);
  }

  save() {

    let removalPromises = [];
    let addressKey = null;
    this.actions.forEach((action) => {
      if (action.type == this.TYPE_REMOVE) {
        removalPromises.push(this.contactsService.remove(action.mAddress.address, action.mAddress.network));
      }
    });
    //removing all entities with existing addresses key
    this.contact.meritAddresses.forEach((mAddress) => {
      removalPromises.push(this.contactsService.remove(mAddress.address, mAddress.network));
    });
    return Promise.all(removalPromises).then(() => {
      if (_.isEmpty(this.contact.meritAddresses)) {
        this.navCtrl.remove(2,1);
        return this.navCtrl.pop();
      } else {
        return this.contactsService.add(this.contact, this.contact.meritAddresses[0].address, ENV.network).then(() => {
          return this.navCtrl.pop();
        });
      }
    });
  }

  // we are able to delete merit contacts and edit name property, instead of contacts in device address book
  isMeritContact() {
    return (!this.contact.phoneNumbers.length && !this.contact.emails.length);
  }

  isSaveAvailable() {
    return this.contact.name.formatted && this.contact.meritAddresses.length;
  }

  deleteContact() {

    let remove = () => {
      this.contact.meritAddresses.forEach((m) => {
        this.removeAddress(m);
      });
      return this.save();
    };

    this.alertCtrl.create({
      title: `Are you sure want to delete this contact?`,
      buttons: [
        {
          text: 'Cancel', role: 'cancel', handler: () => {}
        },
        {
          text: 'Delete', handler: () => {
          remove();
        }
        }
      ]
    }).present();


  }

}
