import { IonicPage, NavParams, NavController,  LoadingController, ModalController, AlertController, Platform  } from 'ionic-angular';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { ProfileService } from '@merit/common/services/profile.service';
import { ToastControllerService, IMeritToastConfig } from '@merit/common/services/toast-controller.service';
import { MERIT_MODAL_OPTS } from '@merit/common/utils/constants';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import { EasySendService } from '@merit/common/services/easy-send.service';
import { getEasySendURL } from '@merit/common/models/easy-send';


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
  showShareButton: boolean;

  @ViewChild('amount') amountInput: ElementRef;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private profileService: ProfileService,
              private toastCtrl: ToastControllerService,
              private loadCtrl: LoadingController,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private socialSharing: SocialSharing,
              private platform: Platform,
              private easySendService: EasySendService
  ) {
    this.address = this.navParams.get('address');
    this.showShareButton = this.platform.is('cordova') && SocialSharing.installed();
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

      const easySend = await this.easySendService.createEasySendScriptHash(this.wallet, '');
      const referral = easySend.scriptReferralOpts;

      await this.wallet.sendReferral(referral);
      await this.wallet.sendInvite(referral.address, this.formData.amount);

      this.link = getEasySendURL(easySend);

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
        message: "Do not forget to copy or share your link, or you can loose invite",
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
