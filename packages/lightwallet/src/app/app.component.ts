import { Component, ViewChild } from '@angular/core';
import { Platform, ModalController, App, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Logger } from 'merit/core/logger';
import { ProfileService } from 'merit/core/profile.service';
import { AppService } from 'merit/core/app-settings.service';
import { ConfigService } from 'merit/shared/config.service';

import { TransactView } from 'merit/transact/transact';
import { OnboardingView } from 'merit/onboard/onboarding.view';
import { FingerprintLockView } from 'merit/utilities/fingerprint-lock/fingerprint-lock';
import { PinLockView } from 'merit/utilities/pin-lock/pin-lock';
import { DeepLinkService } from 'merit/core/deep-link.service';

import { EasyReceiveService } from 'merit/easy-receive/easy-receive.service';
import * as _ from 'lodash';

import { EasyReceipt } from 'merit/easy-receive/easy-receipt.model';
import { PushNotificationsService } from 'merit/core/notification/push-notification.service';

import { Events } from 'ionic-angular';

import { MWCErrors } from 'merit/core/bwc.service';

@Component({
  templateUrl: 'app.html'
})
export class MeritLightWallet {

  @ViewChild(Nav) nav: Nav;

  rootComponent: string = 'OnboardingView';

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private profileService: ProfileService,
    private logger: Logger,
    private modalCtrl: ModalController,
    private appService: AppService,
    private configService: ConfigService,
    private deepLinkService: DeepLinkService,
    private easyReceiveService: EasyReceiveService,
    private app: App,
    private events: Events,
    private pushNotificationService: PushNotificationsService
  ) {
    if (typeof process !== 'undefined') {
        process.on('unhandledRejection', this.logger.info.bind(console));
        process.on('unhandledRejection', this.logger.info.bind(console));
    }
  }

  async ngOnInit() {
    this.platform.resume.subscribe(() => {
      this.logger.info("Returning Native App from Background!");
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

  /**
   * Check the status of the profile, and load the right next view.
   */
  private async loadProfileAndEasySend(): Promise<void> {
    this.logger.info("LoadingProfileAndEasySend");

    let profile;

    try {
      profile = await this.profileService.getProfile();
      this.logger.info("Got Profile....");
      // If the user has credentials and a profile, then let's send them to the transact
      // view
      await this.deepLinkService.initBranch(async (data) => {
        this.logger.info("Branch Data: ", data);
        // If the branch params contain the minimum params needed for an easyReceipt, then
        // let's validate and save them.
        if (data && !_.isEmpty(data) && data.sk && data.se) {
          this.logger.info("About to Validate and Save.");

          try {
            const easyReceipt: EasyReceipt = await this.easyReceiveService.validateAndSaveParams(data);
            this.logger.info("Returned from validate with: ", easyReceipt);

            // We have an easyReceipt, let's handle the cases of being a new user or an
            // existing user.
            if (easyReceipt) {
              if (!(profile && profile.credentials && profile.credentials.length > 0)) {
                // User received easySend, but has no wallets yet.
                // Skip to unlock view.
                return this.nav.setRoot('UnlockView');
              }

              // User is a normal user and needs to be thrown an easyReceive modal.
              return this.nav.setRoot('TransactView');
            }
          } catch (err) {
            this.logger.warn("Error validating and saving easySend params: ", err);
          }
        }
      });

    } catch (err) {
      this.logger.error(err);
    }

    return this.nav.setRoot((profile && profile.credentials && profile.credentials.length > 0) ? 'TransactView' : 'OnboardingView');
  }

  /*
     Upon loading the app (first time or later), we must
     load and bind the persisted profile (if it exists).
  */
  private async initializeApp() {
    this.statusBar.styleLightContent();

    // wait until we have a root view before hiding splash screen
    await this.loadProfileAndEasySend();
    this.splashScreen.hide();
  }

  private openLockModal() {
    let config: any = this.configService.get();
    let lockMethod = config.lock.method;
    if (!lockMethod) return;
    if (lockMethod == 'PIN') this.openPINModal('checkPin');
    if (lockMethod == 'Fingerprint') this.openFingerprintModal();
  }

  private openPINModal(action) {
    let modal = this.modalCtrl.create(PinLockView, { action }, { showBackdrop: false, enableBackdropDismiss: false });
    modal.present();
  }

  private openFingerprintModal() {
    let modal = this.modalCtrl.create(FingerprintLockView, {}, { showBackdrop: false, enableBackdropDismiss: false });
    modal.present();
  }

  private registerMwcErrorHandler() {
    this.events.subscribe(MWCErrors.AUTHENTICATION, () => {
      this.app.getRootNavs()[0].setRoot('NoSessionView');
    });
  }

}
