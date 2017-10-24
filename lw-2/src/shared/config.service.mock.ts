import { Injectable } from '@angular/core';

@Injectable()
export class ConfigServiceMock {

  get() {
    return {
      // wallet limits
      limits: {
        totalCopayers: 6,
        mPlusN: 100
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
          defaultLanguage: ''
        }
      },

      // Bitcore wallet service URL
      bws: {
        url: 'https://bws.merit.me/bws/api'
      },

      download: {
        bitpay: {
          url: 'https://merit.me/wallet'
        },
        copay: {
          url: 'https://merit.me/#download'
        }
      },

      rateApp: {
        lightwallet: {
          ios: 'http://coming.soon',
          android: 'http://coming.soon',
          wp: ''
        }
      },

      lock: {
        method: null,
        value: null,
        bannedUntil: null
      },

      // External services
      recentTransactions: {
        enabled: true
      },

      hideNextSteps: {
        enabled: false
      },

      rates: {
        url: 'https://insight.merit.me:443/api/rates'
      },

      release: {
        url: 'https://api.github.com/repos/bitpay/copay/releases/latest'
      },

      pushNotificationsEnabled: true,

      confirmedTxsNotifications: {
        enabled: true
      },

      emailNotifications: {
        enabled: false
      },

      log: {
        filter: 'debug'
      }
    }
  }

}