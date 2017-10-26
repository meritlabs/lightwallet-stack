import { Injectable } from '@angular/core';
import { Logger } from '@app/core/logger';
import { Events } from 'ionic-angular';
import { PersistenceService } from '@app/core/persistence.service';

import * as _ from "lodash";

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

const configDefault: Config = {
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

@Injectable()
export class ConfigService {
  private configCache: Config;


  constructor(
    private logger: Logger,
    private events: Events,
    private persistence: PersistenceService
  ) {
    this.logger.debug('ConfigService initialized.');
  }

  public load() {
    return new Promise((resolve, reject) => {
      this.persistence.getConfig().then((config: Config) => {
        if (!_.isEmpty(config)) this.configCache = _.clone(config);
        else this.configCache = _.clone(configDefault);
        resolve();
      }).catch((err) => {
        this.logger.error(err);
        reject();
      });
    });
  }

  public set(newOpts: object) {
    let config = _.cloneDeep(configDefault);

    if (_.isString(newOpts)) {
      newOpts = JSON.parse(newOpts);
    }
    _.merge(config, this.configCache, newOpts);
    this.configCache = config;
    this.events.publish('config:updated', this.configCache);

    this.persistence.storeConfig(this.configCache).then(() => {
      this.logger.info('Config saved');
    });
  }

  public get(): Config {
    return this.configCache;
  }

  public getDefaults(): Config {
    return configDefault;
  }

}
