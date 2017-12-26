import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, ModalController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ConfigService } from "merit/shared/config.service";
import { Logger } from 'merit/core/logger';

@IonicPage()
@Component({
  selector: 'view-settings',
  templateUrl: 'settings.html',
})
export class SettingsView {

  public currentLanguageName;
  public availableLanguages = [];
  public currentUnitName;
  public currentAlternativeName;
  public availableUnits = [];
  public availableAlternateCurrencies = [];

  public emailNotificationsEnabled;

  private latestEmail;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private app:App,
    private alertCtrl:AlertController,
    private inAppBrowser:InAppBrowser,
    private modalCtrl:ModalController,
    private configService:ConfigService,
    private logger:Logger
  ) {
    let config = this.configService.get();
    this.currentUnitName = config.wallet.settings.unitName;
    this.currentAlternativeName = config.wallet.settings.alternativeName;
    this.emailNotificationsEnabled = config.emailNotifications.enabled;

  }

  ionViewDidLoad() {
    //do something here
  }

  toAddressbook() {
    this.navCtrl.push('AddressBookView');
  }

  logout() {
    this.app.getRootNav().setRoot('OnboardingView');
  }

  toLanguageSelect() {

    let modal = this.modalCtrl.create('SelectLanguageModal', {currentLanguage: this.currentLanguageName, availableLanguages: [ /* */ ]});
    modal.present();
    modal.onDidDismiss((language) => {
      if (language) this.currentLanguageName = language;
    });
  }

  toFeedback() {
    this.navCtrl.push('FeedbackView');
  }

  toUnitSelect() {
    //@todo get from service
    let modal = this.modalCtrl.create('SelectUnitModal', {currentUnit: this.currentUnitName, availableUnits: [ /* available units */] });
    modal.present();
    modal.onDidDismiss((unit) => {
      this.logger.info(unit);
      if (unit) this.currentUnitName = unit;
    });
  }

  toCurrencySelect() {
    //@todo get from service
    let modal = this.modalCtrl.create('SelectCurrencyModal', {currentCurrency: this.currentAlternativeName, availableCurrencies: [/* available currencies */] });
    modal.present();
    modal.onDidDismiss((unit) => {
      if (unit) this.currentUnitName = unit;
    });
  }

  toAdvancedSettings() {
    this.navCtrl.push('AdvancedSettingsView')
  }

  toAbout() {
    this.navCtrl.push('SettingsAboutView');
  }

  toNotifications() {
    this.navCtrl.push('NotificationsView')
  }

  help() {

    let url = this.configService.get().help.url;

    let confirm = this.alertCtrl.create({
      title: 'External link',
      message: 'Help and support information is available at the website',
      buttons: [
        {text: 'Cancel', role: 'cancel', handler: () => {}},
        {text: 'Open', handler: () => {
          this.inAppBrowser.create(url);
        } }
      ]
    });

    confirm.present();

  }

}
