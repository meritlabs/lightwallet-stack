import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Logger } from 'merit/core/logger';

@Injectable()
export class PlatformService {
  isAndroid: boolean;
  isIOS: boolean;
  isWP: boolean;
  isSafari: boolean;
  isCordova: boolean;
  isNW: boolean;
  ua: string;
  isMobile: boolean;
  isDevel: boolean;
  supportsLedger:boolean;

  constructor(
    private platform: Platform,
    private log: Logger
  ) {
    let chrome: any;
    var ua = navigator ? navigator.userAgent : null;

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
    this.isNW = this.isNodeWebkit();
    this.isMobile = platform.is('mobile');
    this.isDevel = !this.isMobile && !this.isNW;
    this.supportsLedger = window.chrome && window.chrome.runtime && window.chrome.runtime.id && !this.isNW;
  }

  ready() {
    return this.platform.ready();
  }

  getBrowserName(): string {
    let chrome: any;
    let userAgent = window.navigator.userAgent;
    let browsers = { chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i };

    for (let key in browsers) {
      if (browsers[key].test(userAgent)) {
        return key;
      }
    };

    return 'unknown';
  }

  isNodeWebkit(): boolean {
    let isNode = (typeof process !== "undefined" && typeof require !== "undefined");
    if (isNode) {
      try {
        return (typeof require('nw.gui') !== "undefined");
      } catch (e) {
        return false;
      }
    }
  }
}
