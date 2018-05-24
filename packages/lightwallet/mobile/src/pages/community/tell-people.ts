import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Tabs, ViewController, AlertController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ProfileService } from '@merit/common/services/profile.service';
import { ToastControllerService, IMeritToastConfig } from '@merit/common/services/toast-controller.service';


@IonicPage()
@Component({
  selector: 'view-tell-people',
  templateUrl: 'tell-people.html',
})
export class TellPeopleView {

  inviteLink: string;
  showShareButton: boolean = true;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private toastCtrl: ToastControllerService,
    private profileService: ProfileService
  ) {
  }

  async ionViewWillEnter() {
    const wallets = await this.profileService.getWallets();
    let wallet = wallets.find(w => w.confirmed);
    if (!wallet) wallet = wallets[0];
    const code = wallet.confirmed ? (wallet.rootAlias || wallet.rootAddress) : wallet.rootAlias;
    this.inviteLink = 'https://wallet.merit.me?invite='+code;
  }


  copyToClipboard() {
    this.copied = true;
    this.toastCtrl.success('Copied to clipboard');
  }

  share(url: string) {
    this.copied = true;
    //if (SocialSharing.installed()) return this.socialSharing.share(url);
  }

}
