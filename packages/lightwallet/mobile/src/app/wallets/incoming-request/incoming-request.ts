import { Component } from '@angular/core';
import { IonicPage, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';
import { SendService } from 'merit/transact/send/send.service';
import { ContactsProvider } from '../../../providers/contacts/contacts';
import { MeritContact } from '../../../models/merit-contact';
import { IDisplayWallet } from 'merit/../models/display-wallet';
import { MERIT_MODAL_OPTS } from 'merit/../utils/constants';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { ToastConfig } from 'merit/core/toast.config';
import { WalletService } from 'merit/wallets/wallet.service';
import { UnlockRequestService } from 'merit/core/unlock-request.service';

@IonicPage()
@Component({
  selector: 'view-incoming-request',
  templateUrl: 'incoming-request.html',
})
export class IncomingRequestModal {

  public unlockRequest: any;
  public contacts: Array<MeritContact> = [];
  public wallets: Array<IDisplayWallet> = [];

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private modalCtrl: ModalController,
              private contactsService: ContactsProvider,
              private sendService: SendService,
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
    let meritAddress = {
      address: this.unlockRequest.address,
      network: this.sendService.getAddressNetwork(this.unlockRequest.address).name
    };
    let modal = this.modalCtrl.create('SendCreateContactView', { address: meritAddress });
    modal.onDidDismiss((contact) => {
      this.navCtrl.pop();
    });
    modal.present();
  }

  bindContact() {
    let meritAddress = {
      address: this.unlockRequest.address,
      network: this.sendService.getAddressNetwork(this.unlockRequest.address).name
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
      availableWallets: this.wallets
    }, MERIT_MODAL_OPTS);
    modal.onDidDismiss((wallet) => {
      if (wallet) {
        this.unlockRequest.walletClient = wallet.client;
      }
    });
    return modal.present();
  }

}
