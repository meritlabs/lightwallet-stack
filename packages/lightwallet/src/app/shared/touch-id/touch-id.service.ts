import { Injectable } from '@angular/core';
import { PlatformService } from 'merit/core/platform.service';
import { ConfigService } from 'merit/shared/config.service';


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

  async checkIOS() {
    await this.platform.ready();
    this.touchId.isAvailable()
      .then(
      res => this._isAvailable = true,
      err => this.log.info("Fingerprint is not available")
      );
  }

  async checkAndroid() {
    await this.platform.ready();
    const { isAvailable } = await this.androidFingerprintAuth.isAvailable();

    if (isAvailable) {
      this._isAvailable = isAvailable;
    } else {
      this.log.info("Fingerprint is not available")
    }
  }

  async verifyIOSFingerprint(): Promise<any> {
    await this.platform.ready();
    return this.touchId.verifyFingerprint('Scan your fingerprint please');
  }

  async verifyAndroidFingerprint(): Promise<any> {
    await this.platform.ready();

    try {
      const result = await this.androidFingerprintAuth.encrypt({ clientId: 'Copay' });

      if (result.withFingerprint) {
        this.log.info('Successfully authenticated with fingerprint.');
        return;
      }

      if (result.withBackup) {
        this.log.info('Successfully authenticated with backup password!');
        return;
      }

      this.log.info('Didn\'t authenticate!');

    } catch (error) {
      if (error === this.androidFingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
        this.log.warn('Fingerprint authentication cancelled');
        throw error;
      } else {
        this.log.error(error);
        return;
      }
    }
  }

  isAvailable() {
    return this._isAvailable;
  }

  async check(): Promise<any> {
    if (!this.isAvailable()) throw void 0;

    try {
      if (this.platform.isIOS) {
        await this.verifyIOSFingerprint()
      }
      if (this.platform.isAndroid) {
        await this.verifyAndroidFingerprint()
      }
    } catch (err) {
      throw new Error('Fingerprint not verified');
    }
  }

  isNeeded(wallet: any) {
    let config: any = this.config.get();
    config.touchIdFor = config.touchIdFor || {};
    return config.touchIdFor[wallet.credentials.walletId];
  }

  async checkWallet(wallet: any): Promise<any> {
    if (!this.isAvailable()) return; //TODO: Decide how to propogate this.
    if (this.isNeeded(wallet)) {
      try {
        await this.check();
      } catch (e) {
        throw new Error('Fingerprint not verified');
      }
    }
  }
}
