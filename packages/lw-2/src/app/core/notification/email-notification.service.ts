import { Injectable } from '@angular/core';

import * as _ from "lodash";
import * as Promise from 'bluebird';

import { ConfigService } from 'merit/shared/config.service';
import { ProfileService } from 'merit/core/profile.service';
import { WalletService } from 'merit/wallets/wallet.service';

@Injectable()
export class EmailNotificationsService {

  constructor(
    private configService: ConfigService,
    private profileService: ProfileService,
    private walletService: WalletService
  ) {
    console.log('Hello EmailNotificationsService Service');
  }

  public updateEmail(opts: any) {
    opts = opts || {};
    if (!opts.email) return;

    let wallets = this.profileService.getWallets();

    this.configService.set({
      emailFor: null, // Backward compatibility
      emailNotifications: {
        enabled: opts.enabled,
        email: opts.enabled ? opts.email : null
      }
    });

    this.walletService.updateRemotePreferences(wallets);
  };

  public getEmailIfEnabled(config) {
    config = config || this.configService.get();

    if (config.emailNotifications) {
      if (!config.emailNotifications.enabled) return;

      if (config.emailNotifications.email)
        return config.emailNotifications.email;
    }

    if (_.isEmpty(config.emailFor)) return;

    // Backward compatibility
    let emails = _.values(config.emailFor);
    for(var i = 0; i < emails.length; i++) {
      if (emails[i] !== null && typeof emails[i] !== 'undefined') {
        return emails[i];
      }
    }
  };

  public init() {
    let config = this.configService.get();

    if (config.emailNotifications && config.emailNotifications.enabled) {

      // If email already set
      if (config.emailNotifications.emailAddress) return;

      var currentEmail = this.getEmailIfEnabled(config);

      this.updateEmail({
        enabled: currentEmail ? true : false,
        email: currentEmail
      });
    }
  };

}
