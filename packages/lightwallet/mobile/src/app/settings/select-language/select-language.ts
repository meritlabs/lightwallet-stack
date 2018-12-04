import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AlertController, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'view-select-language',
  templateUrl: 'select-language.html',
})
export class SelectLanguageModal {
  currentLanguage;
  availableLanguages;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private viewCtrl: ViewController,
    private iap: InAppBrowser,
  ) {
    this.currentLanguage = this.navParams.get('currentLanguage');
    this.availableLanguages = this.navParams.get('availableLanguages');
  }

  ionViewDidLoad() {
    //do something here
  }

  toCommunity() {
    //@TODO move to configs
    const url = 'https://github.com/meritlabs/lightwallet-stack';

    const confirm = this.alertCtrl.create({
      title: 'External link',
      message:
        'You can see the latest developments and contribute to this open source app by visiting our project on GitHub',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'Open GitHub',
          handler: () => {
            // TODO use an IAP service w/ chrome/safari
            this.iap.create(url);
          },
        },
      ],
    });

    confirm.present();
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  select(language) {
    this.viewCtrl.dismiss(language);
  }
}
