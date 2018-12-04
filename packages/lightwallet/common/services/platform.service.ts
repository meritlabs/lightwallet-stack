import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular/platform/platform';
import { LoggerService } from '@merit/common/services/logger.service';

declare const window: any;

@Injectable()
export class PlatformService {
  isAndroid: boolean;
  isIOS: boolean;
  isWP: boolean;
  isCordova: boolean;
  ua: string;
  isMobile: boolean;
  isDevel: boolean;
  supportsLedger: boolean;

  constructor(private platform: Platform, private log: LoggerService) {
    let ua = navigator ? navigator.userAgent : null;

    if (!ua) {
      this.log.info('Could not determine navigator. Using fixed string');
      ua = 'dummy user-agent';
    }

    // Fixes IOS WebKit UA
    ua = ua.replace(/\(\d+\)$/, '');
    this.ua = ua;
    this.supportsLedger = Boolean(window.chrome && window.chrome.runtime && window.chrome.runtime.id);

    if (platform) {
      this.isAndroid = platform.is('android');
      this.isIOS = platform.is('ios');
      this.isWP = platform.is('windows') && platform.is('mobile');
      this.isCordova = platform.is('cordova');
      this.isMobile = platform.is('mobile');
      this.isDevel = !this.isMobile;
    }
  }

  ready() {
    return this.platform.ready();
  }
}
