import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { ConfigService } from '@merit/common/services/config.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { WalletService } from '@merit/common/services/wallet.service';

@Injectable()
export class EmailNotificationsService {
  constructor(
    private configService: ConfigService,
    private profileService: ProfileService,
    private walletService: WalletService,
  ) {}

  async updateEmail(opts: any) {
    opts = opts || {};
    if (!opts.email) return;

    let wallets = await this.profileService.getWallets();

    await this.configService.set({
      emailFor: null, // Backward compatibility
      emailNotifications: {
        enabled: opts.enabled,
        email: opts.enabled ? opts.email : null,
      },
    });

    return this.walletService.updateRemotePreferences(wallets);
  }

  getEmailIfEnabled(config) {
    config = config || this.configService.get();

    if (config.emailNotifications) {
      if (!config.emailNotifications.enabled) return;

      if (config.emailNotifications.email) return config.emailNotifications.email;
    }

    if (_.isEmpty(config.emailFor)) return;

    // Backward compatibility
    let emails = _.values(config.emailFor);
    for (let i = 0; i < emails.length; i++) {
      if (emails[i] !== null && typeof emails[i] !== 'undefined') {
        return emails[i];
      }
    }
  }

  init() {
    const { emailNotifications } = this.configService.get();
    if (emailNotifications && emailNotifications.enabled) {
      // If email already set
      if (emailNotifications.emailAddress) return;
      let currentEmail = emailNotifications.emailAddress;
      return this.updateEmail({
        enabled: currentEmail ? true : false,
        email: currentEmail,
      });
    }
  }
}
