import { Injectable } from '@angular/core';
import { ProfileService } from '@merit/common/services/profile.service';

export interface ISmsNotificationStatus {
  enabled: boolean;
  phoneNumber?: string;
  platform?: string;
  walletId?: string;
}

@Injectable()
export class SmsNotificationsService {
  constructor(private profileService: ProfileService) {}

  async getSmsSubscriptionStatus(): Promise<ISmsNotificationStatus> {
    const wallets = await this.profileService.getWallets();

    if (!wallets || !wallets.length)
      return { enabled: false };

    let status;

    try {
      status = await wallets[0].getSmsNotificationSubscription();
    } catch (err) {}

    if (!status || !status.phoneNumber)
      return { enabled: false };

    status.enabled = true;
    return status;
  }

  async setSmsSubscription(enabled: boolean, phoneNumber?: string, platform?: string) {
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
