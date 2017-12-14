import { Component } from '@angular/core';
import { Platform, ModalController, App } from 'ionic-angular';
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
import * as Promise from 'bluebird';
import { EasyReceipt } from 'merit/easy-receive/easy-receipt.model';
import { PushNotificationsService } from 'merit/core/notification/push-notification.service';


@Component({
  templateUrl: 'app.html'
})
export class MeritLightWallet {

  public rootComponent;

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
    private pushNotificationService: PushNotificationsService, 
  ) {
    process.on('unhandledRejection', this.logger.info.bind(console));
    Promise.config({
      longStackTraces: true
    });
    process.on('unhandledRejection', this.logger.info.bind(console));
    Promise.onPossiblyUnhandledRejection((error) => {
      throw error;
    });

    this.platform.ready().then((readySource) => {
      this.appService.getInfo().then((appInfo) => {
        this.logger.info(`
            platform ready (${readySource}): -v ${appInfo.version} # ${appInfo.commitHash}
          `);
      });

      return this.initializeApp();
    });


    this.platform.resume.subscribe(() => {
      this.logger.info("Returning Native App from Background!");
      this.loadProfileAndEasySend();
    });
  }

  /**
   * Check the status of the profile, and load the right next view.
   */
  private loadProfileAndEasySend(): void {
    this.profileService.getProfile().then((profile) => {
      // If the user has credentials and a profile, then let's send them to the transact
      // view
      if (!this.rootComponent) {
        this.rootComponent = (profile && profile.credentials && profile.credentials.length) ? 'TransactView' : 'OnboardingView';
      }

      this.deepLinkService.getBranchData(() => { }).then((data) => {
        // If the branch params contain the minimum params needed for an easyReceipt, then
        // let's validate and save them. 
        if (data && !_.isEmpty(data) && data.sk && data.se) {
          this.easyReceiveService.validateAndSaveParams(data).then((easyReceipt: EasyReceipt) => {
            // We have an easyReceipt, let's handle the cases of being a new user or an 
            // existing user.
            if (easyReceipt) {
              if (!(profile && profile.credentials && profile.credentials.length)) {
                // User received easySend, but has no wallets yet. 
                // Skip to unlock view.
                this.rootComponent = 'UnlockView'
              } else {
                // User is a normal user and needs to be thrown an easyReceive modal.
                // TODO: THROW MODAL!  
              }
            }
          }).catch((err) => {
            this.logger.warn("Error validating and saving easySend params: ", err)
          });
        }
      }).catch((err) => {
        this.logger.error(err);
      })
    });

  }

  /*
     Upon loading the app (first time or later), we must
     load and bind the persisted profile (if it exists).
  */
  private initializeApp() {
    this.loadProfileAndEasySend();

    if (this.platform.is('cordova')) {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
    }
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

}

