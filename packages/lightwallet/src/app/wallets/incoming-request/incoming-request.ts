import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { AddressBookService } from 'merit/shared/address-book/address-book.service';
import { SendService } from 'merit/transact/send/send.service';
import { MeritContact } from 'merit/shared/address-book/merit-contact.model';


@IonicPage()
@Component({
  selector: 'view-incoming-request',
  templateUrl: 'incoming-request.html',
})
export class IncomingRequestModal {

  public unlockRequest:any;
  public contacts: Array<MeritContact> = [];

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private addressBookService: AddressBookService,
    private sendService: SendService
  ) {
    this.unlockRequest = this.navParams.get('unlockRequest');
  }

  async ionViewDidLoad() {
    this.contacts = await this.addressBookService.getAllMeritContacts();
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  accept() {
    this.unlockRequest.accepted = true;
  }

  decline() {
    this.viewCtrl.dismiss();
  }

  createContact() {
    let meritAddress = {address: this.unlockRequest.address, network: this.sendService.getAddressNetwork( this.unlockRequest.address).name};
    let modal = this.modalCtrl.create('SendCreateContactView', {address: meritAddress});
    modal.onDidDismiss((contact) => {
      this.viewCtrl.dismiss();
    });
    modal.present();
  }

  bindContact() {
    let meritAddress = {address: this.unlockRequest.address, network: this.sendService.getAddressNetwork( this.unlockRequest.address).name};
    let modal = this.modalCtrl.create('SendSelectBindContactView', {contacts: this.contacts, address: meritAddress});
    modal.onDidDismiss((contact) => {
      this.viewCtrl.dismiss();
    });

    modal.present();
  }

}
