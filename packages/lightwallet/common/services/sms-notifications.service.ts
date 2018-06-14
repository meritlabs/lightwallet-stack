import { Injectable } from '@angular/core';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { ProfileService } from '@merit/common/services/profile.service';

export interface ISmsNotificationStatus {
  enabled: boolean;
  phoneNumber?: string;
  platform?: string;
  walletId?: string;
}

@Injectable()
export class SmsNotificationsService {
  status: ISmsNotificationStatus;

  constructor(private profileService: ProfileService,
              private persistenceService: PersistenceService2) {}

  async getSmsSubscriptionStatus(): Promise<ISmsNotificationStatus> {
    if (this.status) {
      return this.status;
    }

    const wallets = await this.profileService.getWallets();

    let status: ISmsNotificationStatus;

    if (!wallets || !wallets.length) {
      status = { enabled: false };
    } else {

      try {
        status = await wallets[0].getSmsNotificationSubscription();
      } catch (err) {}

      if (!status || !status.phoneNumber) {
        status = { enabled: false };
      } else {
        status.enabled = true;
      }
    }


    await this.persistenceService.setNotificationSettings({
      smsNotifications: status.enabled,
      phoneNumber: status.phoneNumber || ''
    });

    return this.status = status;
  }

  async setSmsSubscription(enabled: boolean, phoneNumber?: string, platform?: string) {
    await this.persistenceService.setNotificationSettings({ smsNotifications: enabled, phoneNumber });

    if (enabled && !phoneNumber)
      return;

    const wallets = await this.profileService.getWallets();
    let promises;

    if (enabled) {
      promises = wallets.map(wallet => wallet.smsNotificationsSubscribe(phoneNumber, platform));
    } else {
      promises = wallets.map(wallet => wallet.smsNotificationsUnsubscribe());
    }

    return Promise.all(promises);
  }
}
