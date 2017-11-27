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
import { PushNotificationsService } from 'merit/core/push-notification.service';
import { FCM } from '@ionic-native/fcm';


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
    private FCM: FCM,
    private pushNotificationService: PushNotificationsService
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
      this.logger.info("Inside Subscribe :: 1")
      return this.deepLinkService.getBranchData(() => { }).then((data) => {
        this.logger.info("Inside Subscribe :: 2")

        return this.profileService.getProfile().then((profile) => {
          this.logger.info("Inside Subscribe :: 3")

          // We have branch data, let's check it for an easySend
          if (data && !_.isEmpty(data)) {
            if (data.sk && data.se) {
              this.logger.info("Inside Subscribe :: 4")

              return this.easyReceiveService.validateAndSaveParams(data).then((easyReceipt) => {
                let viewToNavigate = (profile.credentials && profile.credentials.length) ?
                  'TransactView' : 'UnlockView';
                return this.app.getRootNavs()[0].setRoot(viewToNavigate);
              });
            }
          }
          if (!profile.credentials) {
            this.logger.info("Inside Subscribe :: 5")

            // User is new
            if (data.uc) {
              this.logger.info("Inside Subscribe :: 6")

              // User has an unlockCode from a link they clicked
              this.app.getRootNavs()[0].setRoot('UnlockView', { unlockCode: data.uc });
            } else {
              this.logger.info("Inside Subscribe :: 7")

              return this.app.getRootNavs()[0].setRoot('TourView');
            }
          } else {
            this.logger.info("Inside Subscribe :: 8")

            // User is returning
            return this.app.getRootNavs()[0].setRoot('TransactView');
          }
        });
      });
    })

  }

  /*
     Upon loading the app (first time or later), we must
     load and bind the persisted profile (if it exists).
  */
  private initializeApp() {
    this.logger.info("Inside Initialize :: 1")

    this.profileService.getProfile().then((profile) => {
      this.logger.info("Inside Initialize :: 2")


      this.deepLinkService.getBranchData(() => { }).then((data) => {
        this.logger.info("Inside Initialize :: 3")

        if (data && !_.isEmpty(data)) {
          this.logger.info("Inside Initialize :: 4")

          this.easyReceiveService.validateAndSaveParams(data).then(() => {
            this.logger.info("Inside Initialize :: 5")
            this.logger.info("What's the profile here?: ", profile)

            this.rootComponent = (profile.credentials && profile.credentials.length) ?
              'TransactView' : 'UnlockView';
          }).catch(() => {
            this.logger.info("Inside Initialize :: 6")

            this.rootComponent = (profile.credentials && profile.credentials.length) ?
              'TransactView' : 'OnboardingView';
          });
        } else {
          this.logger.info("Inside Initialize :: 7")

          this.rootComponent = (profile.credentials && profile.credentials.length) ?
            'TransactView' : 'OnboardingView';
        }

      }).catch((err) => {
        this.logger.error(err);
        this.rootComponent = 'OnboardingView';
      })


    });

    if (this.platform.is('cordova')) {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
    }
    // Check Profile
    this.profileService.loadAndBindProfile().then((profile: any) => {

      this.openLockModal();
      if (profile) {
        this.rootComponent = 'TransactView';
      } else {
        //this.profileService.createProfile();
        this.rootComponent = 'OnboardingView';

      }

      // Check Profile
      this.profileService.loadAndBindProfile().then((profile: any) => {

        this.openLockModal();
        if (profile) {
          this.rootComponent = 'TransactView';
        } else {
          //this.profileService.createProfile();
          this.rootComponent = 'OnboardingView';
        }
      }).catch((err: any) => {
        this.logger.warn(err);
        //TODO: Send them somewhere better.
        this.rootComponent = 'OnboardingView';
      });
    });
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

