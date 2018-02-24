import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AlertController, App, IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { Logger } from 'merit/core/logger';
import { ConfigService } from 'merit/shared/config.service';

@IonicPage()
@Component({
  selector: 'view-settings',
  templateUrl: 'settings.html',
})
export class SettingsView {

  currentLanguageName;
  availableLanguages = [];
  currentUnitName;
  currentAlternativeName;
  availableUnits = [];
  availableAlternateCurrencies = [];
  emailNotificationsEnabled;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private app: App,
              private alertCtrl: AlertController,
              private inAppBrowser: InAppBrowser,
              private modalCtrl: ModalController,
              private configService: ConfigService,
              private logger: Logger) {
    let config = this.configService.get();
    this.currentUnitName = config.wallet.settings.unitName;
    this.currentAlternativeName = config.wallet.settings.alternativeName;
    this.emailNotificationsEnabled = config.emailNotifications.enabled;
  }

  logout() {
    this.app.getRootNavs()[0].setRoot('OnboardingView');
  }

  toLanguageSelect() {
    const modal = this.modalCtrl.create('SelectLanguageModal', {
      currentLanguage: this.currentLanguageName,
      availableLanguages: [/* */]
    });
    modal.present();
    modal.onDidDismiss((language) => {
      if (language) this.currentLanguageName = language;
    });
  }

  toUnitSelect() {
    //@todo get from service
    const modal = this.modalCtrl.create('SelectUnitModal', {
      currentUnit: this.currentUnitName,
      availableUnits: [/* available units */]
    });
    modal.present();
    modal.onDidDismiss((unit) => {
      this.logger.info(unit);
      if (unit) this.currentUnitName = unit;
    });
  }

  toCurrencySelect() {
    //@todo get from service
    const modal = this.modalCtrl.create('SelectCurrencyModal', {
      currentCurrency: this.currentAlternativeName,
      availableCurrencies: [/* available currencies */]
    });
    modal.present();
    modal.onDidDismiss((unit) => {
      if (unit) this.currentUnitName = unit;
    });
  }

  help() {
    this.alertCtrl.create({
      title: 'External link',
      message: 'Help and support information is available at the website',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Open',
          handler: () => {
            this.inAppBrowser.create(this.configService.get().help.url);
          }
        }
      ]
    }).present();
  }

}
