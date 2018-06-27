import { Component, ViewChild } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MWCErrors } from '@merit/common/merit-wallet-client/lib/errors';
import { EasyReceipt } from '@merit/common/models/easy-receipt';
import { AddressService } from '@merit/common/services/address.service';
import { AppSettingsService } from '@merit/common/services/app-settings.service';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { EasyReceiveService } from '@merit/common/services/easy-receive.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { PushNotificationsService } from '@merit/common/services/push-notification.service';
import { cleanAddress } from '@merit/common/utils/addresses';
import { DeepLinkService } from '@merit/mobile/app/core/deep-link.service';
import { OnboardingView } from '@merit/mobile/app/onboard/onboarding.view';
import { TransactView } from '@merit/mobile/app/transact/transact';
import { Events, ModalController, Nav, Platform } from 'ionic-angular';

@Component({
  templateUrl: 'app.html'
})
export class MeritLightWallet {

  @ViewChild(Nav) nav: Nav;
  private authorized: boolean;

  constructor(private platform: Platform,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private profileService: ProfileService,
              private logger: LoggerService,
              private modalCtrl: ModalController,
              private appService: AppSettingsService,
              private persistenceService: PersistenceService,
              private deepLinkService: DeepLinkService,
              private easyReceiveService: EasyReceiveService,
              private events: Events,
              private keyboard: Keyboard,
              private addressService: AddressService,
              pushNotificationService: PushNotificationsService) {
  }

  async ngOnInit() {

    if (await this.persistenceService.isPinEnabled()) {
      this.modalCtrl.create('PinLockView').present();
    }

    this.platform.resume.subscribe(() => {
      this.persistenceService.isPinEnabled().then((isEnabled) => {
        this.modalCtrl.create('PinLockView').present();
      });
      this.logger.info('Returning Native App from Background!');
      this.loadEasySend();
    });

    const readySource = await this.platform.ready();

    this.keyboard.hideKeyboardAccessoryBar(false);

    const appInfo: any = await this.appService.getInfo();
    this.logger.info(`
            platform ready (${ readySource }): -v ${ appInfo.version } # ${ appInfo.commitHash }
    `);

    this.registerMwcErrorHandler();

    return this.initializeApp();
  }

  private parseInviteParams() {
    let search = window.location.search;

    if (search && search.indexOf('invite') !== -1) {
      let address = cleanAddress(search.split('?invite=')[1]);
      window.history.replaceState({}, document.title, document.location.pathname);


      if (!this.addressService.couldBeAlias(address) && !this.addressService.isAddress(address)) return;

      const name = this.addressService.couldBeAlias(address) ? '@' + address : 'Someone';
      return { address, name };
    }
  }

  private async loadEasySendInBrowser() {
    let search = window.location.search;
    if (search && search.length > 2) {
      try {
        const params = this.easyReceiveService.parseEasySendUrl(search);
        const easyReceipt: EasyReceipt = await this.easyReceiveService.validateAndSaveParams(params);
        this.logger.info('Returned from validate with: ', easyReceipt);

        // We have an easyReceipt, let's handle the cases of being a new user or an
        // existing user.
        if (easyReceipt) {
          // Let's remove the Query Params from the URL so that the user is not continually loading the same
          // EasyReceipt every time they re-open the app or the browser.
          window.history.replaceState({}, document.title, document.location.pathname);
          return easyReceipt;
        }
      } catch (e) {}
    }
  }

  private async validateAndSaveEasySend(data) {
    try {
      return await this.easyReceiveService.validateAndSaveParams(data);
    } catch (err) {
      this.logger.warn('Error validating and saving easySend params: ', err);
    }
  }


  /**
   * Get Easy send params eiter from url or from branch
   */
  private loadEasySend() {

    if (!this.platform.is('cordova')) return this.loadEasySendInBrowser();

    return new Promise((resolve) => {
      try {
        this.deepLinkService.initBranch(async (data) => {
          const receipt = this.validateAndSaveEasySend(data);
          return resolve(receipt);
        });
      } catch (err) {
        this.logger.error(err);
        return resolve();
      }
    });

  }

  /*
   Upon loading the app (first time or later), we must
   load and bind the persisted profile (if it exists).
   */
  private async initializeApp() {
    if (StatusBar.installed()) {
      // TODO use a status bar service to set color based on page we're on & header color
      if (this.platform.is('android')) {
        this.statusBar.backgroundColorByHexString('0488ab');
      } else if (this.platform.is('ios')) {
        this.statusBar.styleLightContent();
      }
    }

    this.authorized = await this.profileService.isAuthorized();

    const invitation = this.parseInviteParams();
    if (invitation && !this.authorized) {
      await this.nav.setRoot('UnlockView', { invitation });
    } else {

      await this.nav.setRoot(this.authorized ? 'TransactView' : 'OnboardingView');

      // wait until we have a root view before hiding splash screen
      this.splashScreen.hide();

      const receipt = await this.loadEasySend();
      if (receipt) {
        if (!this.authorized) {
          await this.nav.setRoot('UnlockView');
        } else {
          await this.nav.setRoot('TransactView');
        }
      }
    }
  }

  private registerMwcErrorHandler() {
    this.events.subscribe(MWCErrors.AUTHENTICATION_ERROR.name, () => {
      this.nav.setRoot('NoSessionView');
    });
  }

}
