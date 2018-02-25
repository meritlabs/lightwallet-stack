import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AlertController, IonicPage, Platform } from 'ionic-angular';
import { AppService } from '@merit/mobile/app/core/app-settings.service';
import { AppVersion } from '@ionic-native/app-version';

declare const WEBPACK_CONFIG: any;

@IonicPage()
@Component({
  selector: 'view-settings-about',
  templateUrl: 'settings-about.html',
})
export class SettingsAboutView {

  version: string;
  commitHash: string;
  repoUrl: string = this.appSettingsService.info.gitHubRepoUrl;

  constructor(private  alertCtrl: AlertController,
              private inAppBrowser: InAppBrowser,
              private appSettingsService: AppService,
              private appVersion: AppVersion,
              private plt: Platform) {
    if (typeof WEBPACK_CONFIG !== 'undefined') this.commitHash = WEBPACK_CONFIG.COMMIT_HASH;
  }

  async ngOnInit() {
    try {
      await this.plt.ready();
      this.version = 'v' + await this.appVersion.getVersionNumber();
    } catch (e) {
      this.version = 'Unavailable';
    }
  }

  toGithub() {
    this.alertCtrl.create({
      title: 'External link',
      message: 'You can see the latest developments and contribute to this open source app by visiting our project on GitHub',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
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
