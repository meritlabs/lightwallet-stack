import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AppService } from "merit/core/app-settings.service";
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({ 
  selector: 'view-settings-about',
  templateUrl: 'settings-about.html',
})
export class SettingsAboutView {

  public version:string;
  public commitHash:string; 
  public repoUrl:string;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private  alertCtrl:AlertController,
    private inAppBrowser:InAppBrowser,
    private appSettingsService:AppService
  ) {

  }

  async ionViewDidLoad() {

    let info = await this.appSettingsService.getInfo();

    this.version = this.appSettingsService.info.version;
    this.commitHash = this.appSettingsService.info.commitHash;
    this.repoUrl = this.appSettingsService.info.gitHubRepoUrl; 

  }

  toSessionLog() {
    this.navCtrl.push('SessionLogView');
  }

  toTermsOfUse() {
    this.navCtrl.push('TermsOfUseView');
  }

  toGithub() {
    
    let confirm = this.alertCtrl.create({
      title: 'External link',
      message: 'You can see the latest developments and contribute to this open source app by visiting our project on GitHub',
      buttons: [
        {text: 'Cancel', role: 'cancel', handler: () => {}},
        {text: 'Open GitHub', handler: () => {
          this.inAppBrowser.create(this.repoUrl);
        } }
      ]
    });

    confirm.present();
  }

}
