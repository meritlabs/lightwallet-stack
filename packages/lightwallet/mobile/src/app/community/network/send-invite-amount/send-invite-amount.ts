import { IonicPage, NavParams, NavController,  LoadingController, ModalController, AlertController  } from 'ionic-angular';
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

  public link:string;
  copied: boolean;

  @ViewChild('amount') amountInput: ElementRef;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private profileService: ProfileService,
              private toastCtrl: ToastControllerService,
              private loadCtrl: LoadingController,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController
  ) {
    this.address = this.navParams.get('address');
    console.log(this.address, "ADDRESS");
  }

  async ionViewWillEnter() {
    this.wallets = await this.profileService.getWallets();
    this.wallet = this.wallets.find(w => w.availableInvites > 0);
    if (!this.wallet) {
      this.error = 'You have no wallets with available invites now';
    }
  }

  private async send() {
    if (!this.wallet) {
      this.wallet = this.wallets.find(w => (w.availableInvites > 0));
    }
    if (!this.wallet || !this.wallet.availableInvites) {
      return this.toastCtrl.error('You have no active invites');
    }

    let loader = this.loadCtrl.create({ content: 'Creating invite link...' });
    try {
      loader.present();
      this.link = "http://merit.test-app.link/?se=c7eda2aaf493743605af2bcf118df81f&sk=02f328965a06eb3d8d2ef7868becfdfbf2ffd4bc028b0039fab6d9215ddd33be46&sn=MyTest&bt=10080&pa=mTzdxDzF7vJmZiAgSckj8nK4vWJCnSB3Bs";
      //await this.wallet.sendInvite(this.address, this.formData.amount);
      //return this.navCtrl.setRoot('NetworkView');
    } catch (e) {
      console.log(e);
      this.toastCtrl.error('Failed to send invite');
    } finally {
      loader.dismiss();
    }
  }

  public selectWallet() {
    const modal = this.modalCtrl.create('SelectInviteWalletModal', {
      selectedWallet: this.wallet,
      availableWallets: this.wallets.filter((wallet) => wallet.availableInvites > 0)
    }, MERIT_MODAL_OPTS);
    modal.onDidDismiss((wallet) => {
      if (wallet) {
        this.wallet = wallet;
        this.processAmount(this.formData.amount);
      }
    });
    return modal.present();
  }

  public processAmount(amount) {
    this.error = '';
    if (amount > this.wallet.availableInvites) {
      this.error = 'Not enough invites';
    }
  }

  public amountKeypress(key) {
    if (key == 13) return this.amountInput['_native']['nativeElement'].blur();
  }

  focusInput() {
    this.amountInput['_native']['nativeElement'].focus();
  }


  copyToClipboard() {
    this.copied = true;
    this.toastCtrl.success('Copied to clipboard');
  }


  async toWallets() {
    if (this.copied) {
      this.navCtrl.pop();
    } else {
      this.alertCtrl.create({
        title: 'Have you copied/shared your link?',
        message: "Do not forget to copy or share your link, or you can loose money",
        buttons: [
          { text: 'Cancel', role: 'cancel' },
          { text: 'Ok', handler: () => {
            this.navCtrl.pop();
          } }
        ]
      }).present();
    }
  }



}
