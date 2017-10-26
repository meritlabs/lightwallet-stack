import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ExternalLinkService } from "@app/shared/external-link.service";


@IonicPage()
@Component({
  selector: 'page-settings-about',
  templateUrl: 'settings-about.html',
})
export class SettingsAboutView {

  public version = '0.0.0'; //@todo move to config
  public commitHash = 'a1b2c3d4'; //@todo move to config

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private  alertCtrl:AlertController,
    private externalService:ExternalLinkService
  ) {

  }

  ionViewDidLoad() {
    //do something here
  }

  toSessionLog() {
    this.navCtrl.push('SessionLogView');
  }

  toTermsOfUse() {
    this.navCtrl.push('TermsOfUseView');
  }

  toGithub() {
    //@TODO move to configs
    let url = 'https://github.com/meritlabs/lightwallet-stack';

    let confirm = this.alertCtrl.create({
      title: 'External link',
      message: 'You can see the latest developments and contribute to this open source app by visiting our project on GitHub',
      buttons: [
        {text: 'Cancel', role: 'cancel', handler: () => {}},
        {text: 'Open GitHub', handler: () => {this.externalService.open(url)} }
      ]
    });

    confirm.present();
  }

}
