import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Tabs, ViewController } from 'ionic-angular';
import { MeritToastController, ToastConfig } from '@merit/common/services/toast.controller.service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { PlatformService } from '@merit/common/services/platform.service';

@IonicPage()
@Component({
  selector: 'view-easy-send-share',
  templateUrl: 'easy-send-share.html',
})
export class EasySendShareView {

  private txData: any;

  showShareButton: boolean;

  private backButtonAction: Function;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private socialSharing: SocialSharing,
    private toastCtrl: MeritToastController,
    private tabs: Tabs,
    private viewCtrl: ViewController,
    private platform: Platform
  ) {
    this.txData = this.navParams.get('txData');
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
    this.toastCtrl.create({
      message: 'Copied to clipboard',
      cssClass: ToastConfig.CLASS_SUCCESS,
      duration: 3000
    }).present();
  }

  share(url: string) {
    if (SocialSharing.installed()) return this.socialSharing.share(url);
  }

  async toWallets() {
    try {
      await this.navCtrl.popToRoot();
      return this.tabs.select(0);
    } catch (e) {}
  }
}
