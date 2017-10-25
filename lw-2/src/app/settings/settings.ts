import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, ModalController } from 'ionic-angular';
import {ExternalLinkService} from "../../../providers/external-link-service";


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsComponent {

  public currentLanguageName = 'English'; //TODO move to profile or config service
  public currentUnitName     = 'MRT'; //TODO move to profile service
  public currentAlternativeName = 'US Dollar'; //TODO move to profile or config service

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private app:App,
    private alertCtrl:AlertController,
    private externalService:ExternalLinkService,
    private modalCtrl:ModalController
  ) {

  }

  ionViewDidLoad() {
    //do something here
  }

  toAddressbook() {
    this.navCtrl.push('AddressbookComponent');
  }

  logout() {
    this.app.getRootNav().setRoot('OnboardingComponent');
  }

  toLanguageSelect() {
    //@todo get from service
    let modal = this.modalCtrl.create('SelectLanguageModal', {currentLanguage: this.currentLanguageName, availableLanguages: ['English', 'Русский', 'Klingon']});
    modal.present();
    modal.onDidDismiss((language) => {
      if (language) this.currentLanguageName = language;
    });
  }

  toFeedback() {
    this.navCtrl.push('FeedbackComponent');
  }

  toUnitSelect() {
    //@todo get from service
    let modal = this.modalCtrl.create('SelectUnitModal', {currentUnit: this.currentUnitName, availableUnits: ['bits', 'MRT']});
    modal.present();
    modal.onDidDismiss((unit) => {
      console.log(unit);
      if (unit) this.currentUnitName = unit;
    });
  }

  toCurrencySelect() {
    //@todo get from service
    let modal = this.modalCtrl.create('SelectCurrencyModal', {currentCurrency: this.currentAlternativeName, availableCurrencies: ['US Dollar', 'Euro']});
    modal.present();
    modal.onDidDismiss((unit) => {
      if (unit) this.currentUnitName = unit;
    });
  }

  toAdvancedSettings() {
    this.navCtrl.push('AdvancedSettingsComponent')
  }

  toAbout() {
    this.navCtrl.push('SettingsAboutComponent');
  }

  help() {

    //@TODO move to configs
    let url = 'https://';

    let confirm = this.alertCtrl.create({
      title: 'External link',
      message: 'Help and support information is available at the website',
      buttons: [
        {text: 'Cancel', role: 'cancel', handler: () => {}},
        {text: 'Open', handler: () => {this.externalService.open(url)} }
      ]
    });

    confirm.present();

  }


}
