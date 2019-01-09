import { Component } from '@angular/core';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { MeritContact } from '@merit/common/models/merit-contact';
import { AddressService } from '@merit/common/services/address.service';
import { ContactsService } from '@merit/common/services/contacts.service';
import { ToastControllerService } from '@merit/common/services/toast-controller.service';
import { UnlockRequestService } from '@merit/common/services/unlock-request.service';
import { MERIT_MODAL_OPTS } from '@merit/common/utils/constants';
import { IonicPage, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'view-incoming-request',
  templateUrl: 'incoming-request.html',
})
export class IncomingRequestModal {
  public unlockRequest: any;
  public contacts: Array<MeritContact> = [];
  public wallets: Array<MeritWalletClient> = [];

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private contactsService: ContactsService,
    private addressService: AddressService,
    private toastCtrl: ToastControllerService,
    private unlockService: UnlockRequestService,
    private loadingCtrl: LoadingController,
  ) {
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
      this.toastCtrl.error(e.text || 'Unknown Error');
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
      alias: this.unlockRequest.alias,
      network: this.addressService.getAddressNetwork(this.unlockRequest.address).name,
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
      alias: this.unlockRequest.alias,
      network: this.addressService.getAddressNetwork(this.unlockRequest.address).name,
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
    const modal = this.modalCtrl.create(
      'SelectWalletModal',
      {
        showInvites: true,
        selectedWallet: this.unlockRequest.walletClient,
        availableWallets: this.wallets.filter(wallet => wallet.availableInvites > 0),
      },
      MERIT_MODAL_OPTS,
    );
    modal.onDidDismiss(wallet => {
      if (wallet) {
        this.unlockRequest.walletClient = wallet;
      }
    });
    return modal.present();
  }
}
