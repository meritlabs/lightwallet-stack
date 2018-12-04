import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AlertController, App, IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { ConfigService } from '@merit/common/services/config.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { ProfileService } from '@merit/common/services/profile.service';
import { ContactsService } from '@merit/common/services/contacts.service';
import { PersistenceService } from '@merit/common/services/persistence.service';

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

  wallets: Array<MeritWalletClient>;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private app: App,
    private alertCtrl: AlertController,
    private inAppBrowser: InAppBrowser,
    private modalCtrl: ModalController,
    private configService: ConfigService,
    private logger: LoggerService,
    private profileService: ProfileService,
    private contactsService: ContactsService,
    private persistenceService: PersistenceService,
  ) {
    let config = this.configService.get();
    this.currentUnitName = config.wallet.settings.unitName;
    this.currentAlternativeName = config.wallet.settings.alternativeName;
    this.emailNotificationsEnabled = config.emailNotifications.enabled;
    this.wallets = this.navParams.get('wallets');
  }

  async logout() {
    this.alertCtrl
      .create({
        title: 'Have you backed up your wallets?',
        message:
          'This action will delete all Merit data on your device, so if you have no backup, you will lose your wallets for good',
        buttons: [
          { text: 'Cancel', role: 'cancel' },
          {
            text: 'Logout',
            handler: () => {
              const logout = () => {
                const deleteAllData = () =>
                  this.wallets
                    .map(w => this.profileService.deleteWallet(w))
                    .concat(this.contactsService.deleteAddressBook());
                Promise.all(deleteAllData()).then(() => {
                  this.app.getRootNavs()[0].setRoot('OnboardingView');
                });
              };

              this.persistenceService.isPinEnabled().then(pinEnabled => {
                if (pinEnabled) {
                  const modal = this.modalCtrl.create('PinLockView', { showCancelButton: true });
                  modal.onDidDismiss(async success => {
                    if (success) {
                      await this.persistenceService.setPin(null);
                      logout();
                    }
                  });
                  modal.present();
                } else {
                  logout();
                }
              });
            },
          },
        ],
      })
      .present();
  }

  toLanguageSelect() {
    const modal = this.modalCtrl.create('SelectLanguageModal', {
      currentLanguage: this.currentLanguageName,
      availableLanguages: [
        /* */
      ],
    });
    modal.present();
    modal.onDidDismiss(language => {
      if (language) this.currentLanguageName = language;
    });
  }

  toUnitSelect() {
    //@todo get from service
    const modal = this.modalCtrl.create('SelectUnitModal', {
      currentUnit: this.currentUnitName,
      availableUnits: [
        /* available units */
      ],
    });
    modal.present();
    modal.onDidDismiss(unit => {
      this.logger.info(unit);
      if (unit) this.currentUnitName = unit;
    });
  }

  toCurrencySelect() {
    //@todo get from service
    const modal = this.modalCtrl.create('SelectCurrencyModal', {
      currentCurrency: this.currentAlternativeName,
      availableCurrencies: [
        /* available currencies */
      ],
    });
    modal.present();
    modal.onDidDismiss(unit => {
      if (unit) this.currentUnitName = unit;
    });
  }

  help() {
    this.alertCtrl
      .create({
        title: 'External link',
        message: 'Help and support information is available at the website',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {},
          },
          {
            text: 'Open',
            handler: () => {
              this.inAppBrowser.create(this.configService.get().help.url);
            },
          },
        ],
      })
      .present();
  }
}
