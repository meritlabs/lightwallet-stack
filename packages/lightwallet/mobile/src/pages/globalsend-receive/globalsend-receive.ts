import { Component } from '@angular/core';
import {
  Events,
  IonicPage,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
  ViewController,
} from 'ionic-angular';
import { EasyReceiveService } from '@merit/common/services/easy-receive.service';
import { ToastControllerService } from '@merit/common/services/toast-controller.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { EasyReceipt } from '@merit/common/models/easy-receipt';
import { MERIT_MODAL_OPTS } from '@merit/common/utils/constants';

@IonicPage()
@Component({
  selector: 'view-globalsend-receive',
  templateUrl: 'globalsend-receive.html',
})
export class GlobalsendReceiveView {
  receipt: EasyReceipt;
  data;

  validationError: boolean;

  password: string;
  wallets: Array<MeritWalletClient>;
  wallet: MeritWalletClient;

  amountStr: string;
  type: string;
  mode: string;

  loading: boolean = true;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private easyReceiveService: EasyReceiveService,
    private viewController: ViewController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastControllerService,
    private profileService: ProfileService,
    private modalCtrl: ModalController,
    private events: Events,
  ) {
    this.receipt = this.navParams.get('receipt');
    this.data = this.navParams.get('data');
    this.mode = this.navParams.get('mode');
  }

  async ionViewWillEnter() {
    const wallets = await this.profileService.getWallets();
    this.wallet = wallets[0];
    if (!this.wallet) throw new Error('Could not retrieve wallet');

    if (await this.easyReceiveService.isInviteOnly(this.data.txs)) {
      const invitesAmount = await this.easyReceiveService.getInvitesAmount(this.data.txs);
      this.amountStr = invitesAmount == 1 ? 'Invite Token' : invitesAmount + ' Invite tokens';
      this.type = 'MeritInvite';
    } else {
      this.type = 'MeritMoney';
      this.amountStr = (await this.easyReceiveService.getReceiverAmount(this.data.txs)) + ' MRT';
    }
    this.loading = false;
  }

  async accept() {
    let loader = this.loadingCtrl.create({ content: 'Accepting payment...' });
    loader.present();
    try {
      await this.acceptEasyReceipt(this.receipt, this.data);
      this.toastCtrl.success('Payment received');
    } catch (e) {
      console.warn(e);
      this.toastCtrl.error('There was an error retrieving your incoming payment.');
    }
    this.viewController.dismiss();
    loader.dismiss();
  }

  async reject() {
    let loader = this.loadingCtrl.create({ content: 'Rejecting payment...' });
    loader.present();
    try {
      await this.rejectEasyReceipt(this.receipt, this.data);
      this.toastCtrl.success('Payment returned to sender');
    } catch (e) {
      console.warn(e);
      this.toastCtrl.error('There was an error returning payment.');
    }
    this.viewController.dismiss();
    loader.dismiss();
  }

  async ignore() {
    let loader = this.loadingCtrl.create({ content: 'Ignoring...' });
    loader.present();
    try {
      await this.easyReceiveService.deletePendingReceipt(this.receipt);
      this.toastCtrl.success('Payment ignored');
    } catch (e) {
      console.warn(e);
      this.toastCtrl.error('Payment hiding failed');
    }
    this.viewController.dismiss();
    loader.dismiss();
  }

  async validate() {
    let loader = this.loadingCtrl.create({ content: 'Validating...' });
    loader.present();
    this.validationError = false;
    try {
      let data = await this.easyReceiveService.validateEasyReceiptOnBlockchain(this.receipt, this.password);
      let txs = data.txs;

      if (!Array.isArray(txs)) {
        txs = [txs];
      }

      if (!txs.length) {
        this.validationError = true;
        this.password = '';
      } else {
        this.data = data;
        this.mode = 'receive';
      }
    } catch (e) {
      console.warn(e);
      this.toastCtrl.error('Unexpected error occurred');
    }

    loader.dismiss();
  }

  private async acceptEasyReceipt(receipt: EasyReceipt, data: any): Promise<any> {
    await this.easyReceiveService.acceptEasyReceipt(this.wallet, receipt, data, this.wallet.rootAddress.toString());
    this.events.publish('Remote:IncomingTx'); // update wallet info
  }

  private rejectEasyReceipt(receipt: EasyReceipt, data): Promise<any> {
    return this.easyReceiveService.rejectEasyReceipt(this.wallet, receipt, data);
  }

  selectWallet() {
    const modal = this.modalCtrl.create(
      'SelectWalletModal',
      {
        selectedWallet: this.wallet,
        showInvites: true,
        availableWallets: this.wallets,
      },
      MERIT_MODAL_OPTS,
    );

    modal.onDidDismiss(async wallet => {
      if (wallet) {
        this.wallet = wallet;
      }
    });

    modal.present();
  }
}
