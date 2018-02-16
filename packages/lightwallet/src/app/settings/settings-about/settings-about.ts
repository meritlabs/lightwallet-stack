import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AlertController, IonicPage } from 'ionic-angular';
import { AppService } from 'merit/core/app-settings.service';
declare const WEBPACK_CONFIG: any;

@IonicPage()
@Component({
  selector: 'view-settings-about',
  templateUrl: 'settings-about.html',
})
export class SettingsAboutView {

  version: string;
  commitHash: string = typeof WEBPACK_CONFIG !== 'undefined'? WEBPACK_CONFIG.COMMIT_HASH : '1234';
  repoUrl: string;

  constructor(private  alertCtrl: AlertController,
              private inAppBrowser: InAppBrowser,
              private appSettingsService: AppService) {}

  async ionViewDidLoad() {
    this.version = this.appSettingsService.info.version;
    this.repoUrl = this.appSettingsService.info.gitHubRepoUrl;
  }

  toGithub() {
    this.alertCtrl.create({
      title: 'External link',
      message: 'You can see the latest developments and contribute to this open source app by visiting our project on GitHub',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Open GitHub',
          handler: () => {
            this.inAppBrowser.create(this.repoUrl + '/commit/' + this.commitHash, '_system');
          }
        }
      ]
    }).present();
  }

}
