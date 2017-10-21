import { Injectable } from '@angular/core';

@Injectable()
export class ConfigProvider {

  private defaultConfig = {
    // wallet limits
    limits: {
      totalCopayers: 6,
      mPlusN: 100,
    },

    // Bitcore wallet service URL
    bws: {
      // url: 'https://bws.bitpay.com/bws/api',
      url: 'http://127.0.0.1:3232/bws/api',
    },

    download: {
      url: 'https://example.com'
    },

    rateApp: {
      bitpay: {
        ios: 'http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=1149581638&componentNumber=0&sortOrdering=2&type=Purple+Software&mt=8',
        android: 'https://play.google.com/store/apps/details?id=com.bitpay.wallet',
        wp: ''
      },
      copay: {
        ios: 'http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=951330296&componentNumber=0&sortOrdering=2&type=Purple+Software&mt=8',
        android: 'https://play.google.com/store/apps/details?id=com.bitpay.copay',
        wp: ''
      }
    },
    // wallet default config
    wallet: {
      requiredCopayers: 2,
      totalCopayers: 3,
      spendUnconfirmed: false,
      reconnectDelay: 5000,
      idleDurationMin: 4,
      settings: {
        unitName: 'MRT',
        unitToMicro: 100000000,
        unitDecimals: 8,
        unitCode: 'mrt',
        alternativeName: 'US Dollar',
        alternativeIsoCode: 'USD',
      }
    },


    lock: {
      method: null,
      value: null,
      bannedUntil: null,
    },

    // External services
    recentTransactions: {
      enabled: true,
    },

    hideNextSteps: {
      //enabled: isWindowsPhoneApp ? true : false,
      enabled: false
    },

    rates: {
      url: 'https://insight.bitpay.com:443/api/rates',
    },

    release: {
      url: 'https://api.github.com/repos/bitpay/copay/releases/latest'
    },

    pushNotificationsEnabled: true,

    confirmedTxsNotifications: {
      enabled: true,
    },

    emailNotifications: {
      enabled: false,
    },

    log: {
      filter: 'debug',
    },
  };

  getDefaults() {
    return Object.assign({}, this.defaultConfig);
  }

}