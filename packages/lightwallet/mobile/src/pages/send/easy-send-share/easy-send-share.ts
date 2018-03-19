import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MeritToastController, ToastConfig } from '@merit/common/services/toast.controller.service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { PlatformService } from '@merit/common/services/platform.service';

@IonicPage()
@Component({
  selector: 'view-easy-send-share',
  templateUrl: 'easy-send-share.html',
})
export class EasySendShareView {

  private txData:any;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private socialSharing: SocialSharing,
    private toastCtrl: MeritToastController,
    private platformService: PlatformService
  ) {
    this.txData = this.navParams.get('txData');
  }


  copyToClipboard(url) {
    this.toastCtrl.create({
      message: 'Copied to clipboard',
      cssClass: ToastConfig.CLASS_SUCCESS
    }).present();
  }

  share(url) {
    if (SocialSharing.installed()) return this.socialSharing.share(url);
  }

  toWallets() {
    this.navCtrl.popToRoot();
  }

  showShareButton() {
    return (
      this.platformService.isCordova
    );
  }

}
