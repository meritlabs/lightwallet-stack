import { Injectable } from '@angular/core';
import { PlatformService } from 'merit/core/platform.service';
import { ConfigService } from 'merit/shared/config.service';
import * as Promise from 'bluebird';

import { TouchID } from '@ionic-native/touch-id';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { Logger } from 'merit/core/logger';

@Injectable()
export class TouchIdService {

  private _isAvailable: boolean = false; 

  constructor(
    private touchId: TouchID,
    private androidFingerprintAuth: AndroidFingerprintAuth,
    private platform: PlatformService,
    private config: ConfigService,
    private log: Logger
  ) { }

  init() {
    if (this.platform.isAndroid) this.checkAndroid();
    if (this.platform.isIOS) this.checkIOS();
  }

  checkIOS() {
    this.touchId.isAvailable()
      .then(
      res => this._isAvailable = true,
      err => this.log.info("Fingerprint is not available")
      );
  }

  checkAndroid() {
    this.androidFingerprintAuth.isAvailable()
      .then(
      res => {
        if (res.isAvailable) this._isAvailable = true
        else this.log.info("Fingerprint is not available")
      });
  }

  verifyIOSFingerprint(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.touchId.verifyFingerprint('Scan your fingerprint please')
        .then(
        res => resolve(),
        err => reject(err)
        );
    });
  }

  verifyAndroidFingerprint(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.androidFingerprintAuth.encrypt({ clientId: 'Copay' })
        .then(result => {
          if (result.withFingerprint) {
            this.log.info('Successfully authenticated with fingerprint.');
            resolve();
          } else if (result.withBackup) {
            this.log.info('Successfully authenticated with backup password!');
            resolve();
          } else this.log.info('Didn\'t authenticate!');
        }).catch(error => {
          if (error === this.androidFingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
            this.log.warn('Fingerprint authentication cancelled');
            reject(error);
          } else {
            this.log.error(error);
            resolve();
          };
        });
    });
  }

  isAvailable() {
    return this._isAvailable;
  }

  check(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.isAvailable()) reject(new Error('TouchId not available'));
      if (this.platform.isIOS) {
        this.verifyIOSFingerprint()
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject(new Error('Fingerprint not verified'));
          });
      };
      if (this.platform.isAndroid) {
        this.verifyAndroidFingerprint()
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject(new Error('Fingerprint not verified'));
          });
      };
    });
  }

  isNeeded(wallet: any) {
    let config: any = this.config.get();
    config.touchIdFor = config.touchIdFor || {};
    return config.touchIdFor[wallet.credentials.walletId];
  }

  checkWallet(wallet: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.isAvailable()) return resolve(); //TODO: Decide how to propogate this.
      if (this.isNeeded(wallet)) {
        this.check().then(() => {
          return resolve();
        }).catch(() => {
          return reject(new Error('Fingerprint not verified'));
        });
      };
    });
  }
}
