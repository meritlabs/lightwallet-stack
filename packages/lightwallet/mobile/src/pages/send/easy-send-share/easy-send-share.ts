import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Tabs, ViewController, AlertController } from 'ionic-angular';
import { ToastControllerService, IMeritToastConfig } from '@merit/common/services/toast-controller.service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { PlatformService } from '@merit/common/services/platform.service';

@IonicPage()
@Component({
  selector: 'view-easy-send-share',
  templateUrl: 'easy-send-share.html',
})
export class EasySendShareView {
  txData: any;
  easySendDelivered: boolean;

  showShareButton: boolean;
  copied: boolean;

  private backButtonAction: Function;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private socialSharing: SocialSharing,
    private toastCtrl: ToastControllerService,
    private tabs: Tabs,
    private viewCtrl: ViewController,
    private platform: Platform,
    private alertController: AlertController,
  ) {
    this.txData = this.navParams.get('txData');
    this.easySendDelivered = this.navParams.get('easySendDelivered');
    this.showShareButton = this.platform.is('cordova') && SocialSharing.installed();
  }

  ionViewWillEnter() {
    // hide back button in case it's showing
    this.viewCtrl.showBackButton(false);

    // override backbutton action
    this.backButtonAction = this.platform.registerBackButtonAction(() => {
      this.toWallets();
    }, 100);
  }

  ionViewDidEnter() {
    // disable swipe to go back
    this.navCtrl.swipeBackEnabled = false;
  }

  ionViewWillLeave() {
    // allow swipe to go back on iOS
    this.navCtrl.swipeBackEnabled = true;

    // clear back button handler
    if (typeof this.backButtonAction == 'function') {
      this.backButtonAction();
    }
  }

  copyToClipboard() {
    this.copied = true;
    this.toastCtrl.success('Copied to clipboard');
  }

  share(url: string) {
    this.copied = true;
    if (SocialSharing.installed()) return this.socialSharing.share(url);
  }

  async toWallets() {
    if (this.copied) {
      this.goToWallets();
    } else {
      this.alertController
        .create({
          title: 'Have you copied/shared your link?',
          message: 'Do not forget to copy or share your link, or you can loose money',
          buttons: [
            { text: 'Cancel', role: 'cancel' },
            {
              text: 'Ok',
              handler: () => {
                this.goToWallets();
              },
            },
          ],
        })
        .present();
    }
  }

  private async goToWallets() {
    try {
      await this.navCtrl.popToRoot();
      return this.tabs.select(0);
    } catch (e) {}
  }
}
