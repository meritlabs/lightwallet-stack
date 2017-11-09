import { Injectable } from '@angular/core';
import { Logger } from 'merit/core/logger';

import { Events } from 'ionic-angular';

interface Config {
  limits: {
    totalCopayers: number;
    mPlusN: number;
  };

  wallet: {
    requiredCopayers: number;
    totalCopayers: number;
    spendUnconfirmed: boolean;
    reconnectDelay: number;
    idleDurationMin: number;
    settings: {
      unitName: string;
      unitToSatoshi: number;
      unitDecimals: number;
      unitCode: string;
      alternativeName: string;
      alternativeIsoCode: string;
      defaultLanguage: string;
    };
  };

  bws: {
    url: string;
  };

  download: {
    bitpay: {
      url: string;
    };
    copay: {
      url: string;
    }
  };

  rateApp: {
    lightwallet: {
      ios: string;
      android: string;
      wp: string;
    };
  };

  lock: {
    method: any;
    value: any;
    bannedUntil: any;
  };

  recentTransactions: {
    enabled: boolean;
  };

  hideNextSteps: {
    enabled: boolean;
  };

  rates: {
    url: string;
  };

  release: {
    url: string;
  };

  pushNotificationsEnabled: boolean;

  confirmedTxsNotifications: {
    enabled: boolean;
  };

  emailNotifications: {
    enabled: boolean;
  };

  log: {
    filter: string;
  };
};

@Injectable()
export class ConfigServiceMock {
  private configCache: Config;


  constructor(
    private logger: Logger
  ) {
    this.logger.warn('Using mock service ConfigServiceMock');
  }

  public load() {
  }

  public set() {

  }

  public get(): Config {

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
            unitToSatoshi: 100000000,
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
    };

  }

  public getDefaults(): Config {

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
          unitToSatoshi: 100000000,
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
    };

  }

}
