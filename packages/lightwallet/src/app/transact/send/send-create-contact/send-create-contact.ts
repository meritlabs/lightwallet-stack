import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

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
  public addAddressMode:boolean;
  public newAddress:string;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private addressBook: AddressBookService,
    private sendService: SendService,
    private toastController: MeritToastController,
    private viewCtrl: ViewController
  ) {
    let address = this.navParams.get('address');
    this.contact = new MeritContact();
    this.contact.meritAddresses.push(address);

  }

  ionViewDidLoad() {

  }

  save() {
    return this.addressBook.add(this.contact, this.contact.meritAddresses[0].address, this.contact.meritAddresses[0].network).then(() => {
      this.viewCtrl.dismiss(this.contact);
    });
  }

  async addAddress(address) {

    if (this.contact.meritAddresses.filter(m => m.address == address).length) {
      return this.toastController.create({
        message: 'Address is already bound to this contact',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }

    let isAddressValid =  await this.sendService.isAddressValid(address);
    if (!isAddressValid) {
      return this.toastController.create({
        message: 'Address is invalid or not invited to blockchain yet',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }

    let network = this.sendService.getAddressNetwork(address).name;
    let meritAddress = {address, network};
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
