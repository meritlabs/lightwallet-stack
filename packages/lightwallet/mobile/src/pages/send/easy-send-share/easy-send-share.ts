import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs, ViewController } from 'ionic-angular';
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

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private socialSharing: SocialSharing,
    private toastCtrl: MeritToastController,
    private platformService: PlatformService,
    private tabs: Tabs,
    private viewCtrl: ViewController
  ) {
    this.txData = this.navParams.get('txData');
    this.showShareButton = this.platformService.isCordova && SocialSharing.installed();
  }

  ionViewWillEnter() {
    this.viewCtrl.showBackButton(false);
  }

  ionViewDidEnter() {
    this.navCtrl.swipeBackEnabled = false;
  }

  ionViewWillLeave() {
    this.navCtrl.swipeBackEnabled = true;
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
