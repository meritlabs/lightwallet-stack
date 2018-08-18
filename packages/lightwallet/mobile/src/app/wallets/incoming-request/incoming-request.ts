import { Component } from '@angular/core';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { MeritContact } from '@merit/common/models/merit-contact';
import { AddressService } from '@merit/common/services/address.service';
import { ContactsService } from '@merit/common/services/contacts.service';
import { ToastControllerService } from '@merit/common/services/toast-controller.service';
import { MERIT_MODAL_OPTS } from '@merit/common/utils/constants';
import { IonicPage, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { InviteRequest } from '@merit/common/services/invite-request.service';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';
import { selectWalletsWithInvites } from '@merit/common/reducers/wallets.reducer';
import { getLatestValue } from '@merit/common/utils/observables';
import { ENV } from '@app/env';

@IonicPage()
@Component({
  selector: 'view-incoming-request',
  templateUrl: 'incoming-request.html',
})
export class IncomingRequestModal {

  inviteRequest: InviteRequest;
  contacts: MeritContact[] = [];
  wallets$: Observable<DisplayWallet[]> = this.store.select(selectWalletsWithInvites);
  selectedWallet: DisplayWallet;
  isConfirmed: boolean;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private modalCtrl: ModalController,
              private contactsService: ContactsService,
              private addressService: AddressService,
              private toastCtrl: ToastControllerService,
              private loadingCtrl: LoadingController,
              private store: Store<IRootAppState>) {
    this.inviteRequest = this.navParams.get('request');
  }

  async ngOnInit() {
    const wallets = await getLatestValue(this.wallets$);
    this.selectedWallet = wallets[0];
  }

  async ionViewDidLoad() {
    this.contacts = await this.contactsService.getAllMeritContacts();
  }

  async accept() {
    const loader = this.loadingCtrl.create({ content: 'Confirming request...' });
    try {
      loader.present();
      await this.inviteRequest.accept(this.selectedWallet.client);
    } catch (e) {
      this.toastCtrl.error(e.text || 'Unknown Error');
    } finally {
      loader.dismiss();
    }
  }

  async decline() {
    await this.inviteRequest.ignore();
    this.navCtrl.pop();
  }

  createContact() {
    const meritAddress = {
      address: this.inviteRequest.address,
      alias: this.inviteRequest.alias,
      network: ENV.network,
    };
    const modal = this.modalCtrl.create('SendCreateContactView', { address: meritAddress });
    modal.onDidDismiss(() => {
      this.navCtrl.pop();
    });
    modal.present();
  }

  bindContact() {
    const meritAddress = {
      address: this.inviteRequest.address,
      alias: this.inviteRequest.alias,
      network: ENV.network,
    };
    const modal = this.modalCtrl.create('SendSelectBindContactView', { contacts: this.contacts, address: meritAddress });
    modal.onDidDismiss(() => {
      this.navCtrl.pop();
    });

    modal.present();
  }

  continue() {
    this.navCtrl.pop();
  }

  async selectWallet() {
    const modal = this.modalCtrl.create('SelectWalletModal', {
      showInvites: true,
      selectedWallet: this.selectedWallet,
      availableWallets: await getLatestValue(this.wallets$),
    }, MERIT_MODAL_OPTS);
    modal.onDidDismiss((wallet: DisplayWallet) => {
      if (wallet) {
        this.selectedWallet = wallet;
      }
    });
    return modal.present();
  }
}
