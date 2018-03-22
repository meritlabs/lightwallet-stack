import { Component } from '@angular/core';
import {
  IonicPage,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import { MeritContact } from '@merit/common/models/merit-contact';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { ContactsService } from '@merit/common/services/contacts.service';
import { UnlockRequestService } from '@merit/common/services/unlock-request.service';
import { MERIT_MODAL_OPTS } from '@merit/common/utils/constants';
import { AddressService } from '@merit/common/services/address.service';
import { ToastConfig } from '@merit/common/services/toast.controller.service';

@IonicPage()
@Component({
  selector: 'view-incoming-request',
  templateUrl: 'incoming-request.html',
})
export class IncomingRequestModal {

  public unlockRequest: any;
  public contacts: Array<MeritContact> = [];
  public wallets: Array<DisplayWallet> = [];

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private modalCtrl: ModalController,
              private contactsService: ContactsService,
              private addressService: AddressService,
              private toastCtrl: ToastController,
              private unlockService: UnlockRequestService,
              private loadingCtrl: LoadingController) {
    this.unlockRequest = this.navParams.get('request');
    this.wallets = this.navParams.get('wallets');
  }

  async ionViewDidLoad() {
    this.contacts = await this.contactsService.getAllMeritContacts();
  }

  async accept() {
    const loader = this.loadingCtrl.create({ content: 'Confirming request...' });
    try {
      loader.present();
      await this.unlockService.confirmRequest(this.unlockRequest);
    } catch (e) {
      this.toastCtrl.create({
        message: e.text || 'Unknown Error',
        position: ToastConfig.POSITION,
        duration: ToastConfig.DURATION,
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    } finally {
      loader.dismiss();
    }
  }

  async decline() {
    await this.unlockService.hideRequest(this.unlockRequest);
    this.navCtrl.pop();
  }

  createContact() {
    const meritAddress = {
      address: this.unlockRequest.address,
      network: this.addressService.getAddressNetwork(this.unlockRequest.address).name
    };
    const modal = this.modalCtrl.create('SendCreateContactView', { address: meritAddress });
    modal.onDidDismiss(() => {
      this.navCtrl.pop();
    });
    modal.present();
  }

  bindContact() {
    let meritAddress = {
      address: this.unlockRequest.address,
      network: this.addressService.getAddressNetwork(this.unlockRequest.address).name
    };
    let modal = this.modalCtrl.create('SendSelectBindContactView', { contacts: this.contacts, address: meritAddress });
    modal.onDidDismiss(() => {
      this.navCtrl.pop();
    });

    modal.present();
  }

  continue() {
    this.navCtrl.pop();
  }

  selectWallet() {
    const modal = this.modalCtrl.create('SelectInviteWalletModal', {
      selectedWallet: this.unlockRequest.walletClient,
      availableWallets: this.wallets.filter((wallet: DisplayWallet) => wallet.invites > 0)
    }, MERIT_MODAL_OPTS);
    modal.onDidDismiss((wallet) => {
      if (wallet) {
        this.unlockRequest.walletClient = wallet.client;
      }
    });
    return modal.present();
  }
}
