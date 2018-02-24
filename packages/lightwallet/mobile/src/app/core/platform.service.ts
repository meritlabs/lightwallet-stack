import { Injectable, Optional } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Logger } from 'merit/core/logger';

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

  constructor(@Optional() private platform: Platform,
              private log: Logger) {
    let ua = navigator ? navigator.userAgent : null;

    if (!ua) {
      this.log.info('Could not determine navigator. Using fixed string');
      ua = 'dummy user-agent';
    }

    // Fixes IOS WebKit UA
    ua = ua.replace(/\(\d+\)$/, '');

    this.isAndroid = platform.is('android');
    this.isIOS = platform.is('ios');
    this.isWP = platform.is('windows') && platform.is('mobile');
    this.ua = ua;
    this.isCordova = platform.is('cordova');
    this.isMobile = platform.is('mobile');
    this.isDevel = !this.isMobile;
    this.supportsLedger = Boolean(window.chrome && window.chrome.runtime && window.chrome.runtime.id);
  }

  ready() {
    return this.platform.ready();
  }
}
