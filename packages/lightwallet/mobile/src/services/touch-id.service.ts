import { Injectable } from '@angular/core';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { TouchID } from '@ionic-native/touch-id';
import { PlatformService } from '@merit/common/services/platform.service';
import { ConfigService } from '@merit/common/services/config.service';
import { LoggerService } from '@merit/common/services/logger.service';

@Injectable()
export class TouchIdService {

  private _isAvailable: boolean;

  constructor(private touchId: TouchID,
              private androidFingerprintAuth: AndroidFingerprintAuth,
              private platform: PlatformService,
              private config: ConfigService,
              private log: LoggerService) {
  }

  async checkIOS() {
    try {
      await this.touchId.isAvailable();
      return true;
    } catch (e) {
      return false;
    }
  }

  async checkAndroid() {
    try {
      return (await this.androidFingerprintAuth.isAvailable()).isAvailable;
    } catch (e) {
      return false;
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

  async isAvailable() {
    if (this._isAvailable == undefined) {

      await this.platform.ready();
      if (this.platform.isAndroid) {
        this._isAvailable = await this.checkAndroid();
      } else  if (this.platform.isIOS) {
        this._isAvailable =  await this.checkIOS();
      } else {
        this._isAvailable = false;
      }
    }
    return this._isAvailable;
  }

  async check(): Promise<any> {
    if (!this.isAvailable()) throw void 0;

    try {
      if (this.platform.isIOS) {
        await this.verifyIOSFingerprint();
      }
      if (this.platform.isAndroid) {
        await this.verifyAndroidFingerprint();
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
