import { IonicPage, NavParams, NavController,  LoadingController, ModalController  } from 'ionic-angular';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { ProfileService } from '@merit/common/services/profile.service';
import { ToastControllerService, IMeritToastConfig } from '@merit/common/services/toast-controller.service';
import { MERIT_MODAL_OPTS } from '@merit/common/utils/constants';
import { Component, ElementRef, ViewChild } from '@angular/core';


@IonicPage()
@Component({
  selector: 'view-send-invite-amount',
  templateUrl: 'send-invite-amount.html'
})
export class SendInviteAmountView {

  public  wallets: Array<MeritWalletClient>;
  public wallet: MeritWalletClient;

  public formData = {amount: 1};
  public address;

  public error:string;

  @ViewChild('amount') amountInput: ElementRef;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private profileService: ProfileService,
              private toastCtrl: ToastControllerService,
              private loadCtrl: LoadingController,
              private modalCtrl: ModalController
  ) {
    this.address = this.navParams.get('address');
  }

  async ionViewWillEnter() {
    this.wallets = await this.profileService.getWallets();
    this.wallet = this.wallets.find(w => w.availableInvites > 0);
    if (!this.wallet) {
      this.error = 'You have no wallets with available invites now';
    }
  }

  async send() {
    if (!this.wallet) {
      this.wallet = this.wallets.find(w => (w.availableInvites > 0));
    }
    if (!this.wallet || !this.wallet.availableInvites) {
      return this.toastCtrl.error('You have no active invites');
    }

    let loader = this.loadCtrl.create({ content: 'Sending invite...' });
    try {
      loader.present();
      await this.wallet.sendInvite(this.address, this.formData.amount);
      return this.navCtrl.setRoot('NetworkView');
    } catch (e) {
      console.log(e);
      this.toastCtrl.error('Failed to send invite');
    } finally {
      loader.dismiss();
    }
  }

  selectWallet() {
    const modal = this.modalCtrl.create('SelectWalletModal', {
      selectedWallet: this.wallet,
      availableWallets: this.wallets.filter(wallet => wallet.availableInvites > 0)
    }, MERIT_MODAL_OPTS);
    modal.onDidDismiss((wallet) => {
      if (wallet) {
        this.wallet = wallet;
        this.processAmount(this.formData.amount);
      }
    });
    return modal.present();
  }

  processAmount(amount) {
    this.error = '';
    if (amount > this.wallet.availableInvites) {
      this.error = 'Not enough invites';
    }
  }

  amountKeypress(key) {
    if (key == 13) return this.amountInput['_native']['nativeElement'].blur();
  }

  focusInput() {
    this.amountInput['_native']['nativeElement'].focus();
  }

}
