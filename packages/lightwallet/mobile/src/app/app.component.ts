import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MWCErrors } from '@merit/common/merit-wallet-client/lib/errors';
import { EasyReceipt } from '@merit/common/models/easy-receipt';
import { AppSettingsService } from '@merit/common/services/app-settings.service';
import { ConfigService } from '@merit/common/services/config.service';
import { EasyReceiveService } from '@merit/common/services/easy-receive.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { PushNotificationsService } from '@merit/common/services/push-notification.service';
import { DeepLinkService } from '@merit/mobile/app/core/deep-link.service';
import { OnboardingView } from '@merit/mobile/app/onboard/onboarding.view';
import { TransactView } from '@merit/mobile/app/transact/transact';
import { FingerprintLockView } from '@merit/mobile/app/utilities/fingerprint-lock/fingerprint-lock';
import { PinLockView } from '@merit/mobile/app/utilities/pin-lock/pin-lock';
import { Events, ModalController, Nav, Platform } from 'ionic-angular';
import { isEmpty } from 'lodash';

@Component({
  templateUrl: 'app.html'
})
export class MeritLightWallet {

  @ViewChild(Nav) nav: Nav;

  rootComponent: string;

  constructor(private platform: Platform,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private profileService: ProfileService,
              private logger: LoggerService,
              private modalCtrl: ModalController,
              private appService: AppSettingsService,
              private configService: ConfigService,
              private deepLinkService: DeepLinkService,
              private easyReceiveService: EasyReceiveService,
              private events: Events,
              pushNotificationService: PushNotificationsService) {
  }

  async ngOnInit() {
    this.platform.resume.subscribe(() => {
      this.logger.info('Returning Native App from Background!');
      this.loadProfileAndEasySend();
    });

    const readySource = await this.platform.ready();

    const appInfo: any = await this.appService.getInfo();
    this.logger.info(`
            platform ready (${ readySource }): -v ${ appInfo.version } # ${ appInfo.commitHash }
    `);

    this.registerMwcErrorHandler();

    return this.initializeApp();
  }

  private async loadEasySendInBrowser() {

    let search = window.location.search;
    if (search && search.length > 2) {
      try {
        const data: any = {};
        search
          .substr(1)
          .split('&')
          .forEach((q: any) => {
            q = q.split('=');
            data[q[0]] = q[1];
          });

        const easyReceipt: EasyReceipt = await this.easyReceiveService.validateAndSaveParams(data);
        this.logger.info('Returned from validate with: ', easyReceipt);

        // We have an easyReceipt, let's handle the cases of being a new user or an
        // existing user.
        if (easyReceipt) {
          if (!await this.profileService.isAuthorized()) {
            // User received easySend, but has no wallets yet.
            // Skip to unlock view.
            await this.nav.setRoot('UnlockView');
          } else {
            // User is a normal user and needs to be thrown an easyReceive modal.
            await this.nav.setRoot('TransactView');
          }

          return true;
        }
      } catch (e) {}
    }
  }

  /**
   * Check the status of the profile, and load the right next view.
   */
  private async loadProfileAndEasySend() {
    this.logger.info('LoadingProfileAndEasySend');

    if (!this.platform.is('cordova')) return this.loadEasySendInBrowser();

    try {
      this.logger.info('Got Profile....');
      // If the user has credentials and a profile, then let's send them to the transact
      // view

      const isAuthorized = await this.profileService.isAuthorized();
      return new Promise<boolean>((resolve) => {
        this.deepLinkService.initBranch(async (data) => {
          this.logger.info('Branch Data: ', data);
          // If the branch params contain the minimum params needed for an easyReceipt, then
          // let's validate and save them.
          if (data && !isEmpty(data) && data.sk && data.se) {
            this.logger.info('About to Validate and Save.');

            try {
              const easyReceipt: EasyReceipt = await this.easyReceiveService.validateAndSaveParams(data);
              this.logger.info('Returned from validate with: ', easyReceipt);

              // We have an easyReceipt, let's handle the cases of being a new user or an
              // existing user.
              if (easyReceipt) {

                if (!isAuthorized) {
                  // User received easySend, but has no wallets yet.
                  // Skip to unlock view.
                  await this.nav.setRoot('UnlockView');
                } else {
                  // User is a normal user and needs to be thrown an easyReceive modal.
                  await this.nav.setRoot('TransactView');
                }

                return resolve(true);
              }
            } catch (err) {
              this.logger.warn('Error validating and saving easySend params: ', err);
            }
          }

          resolve(false);
        });
      });

    } catch (err) {
      this.logger.error(err);
    }
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

    const receivedEasySend: boolean = await this.loadProfileAndEasySend();

    if (!receivedEasySend) {
      const authorized = await this.profileService.isAuthorized();
      await this.nav.setRoot( authorized ? 'TransactView' : 'OnboardingView');
    }

    // wait until we have a root view before hiding splash screen
    this.splashScreen.hide();
  }

  // private openLockModal() {
  //   let config: any = this.configService.get();
  //   let lockMethod = config.lock.method;
  //   if (!lockMethod) return;
  //   if (lockMethod == 'PIN') this.openPINModal('checkPin');
  //   if (lockMethod == 'Fingerprint') this.openFingerprintModal();
  // }
  //
  // private openPINModal(action) {
  //   let modal = this.modalCtrl.create(PinLockView, { action }, { showBackdrop: false, enableBackdropDismiss: false });
  //   modal.present();
  // }
  //
  // private openFingerprintModal() {
  //   let modal = this.modalCtrl.create(FingerprintLockView, {}, { showBackdrop: false, enableBackdropDismiss: false });
  //   modal.present();
  // }

  private registerMwcErrorHandler() {
    this.events.subscribe(MWCErrors.AUTHENTICATION_ERROR.name, () => {
      this.nav.setRoot('NoSessionView');
    });
  }

}
