import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { LoggerService } from '@merit/common/services/logger.service';

@Injectable()
export class PushNotificationsService {
  protected token: string;
  protected platform: string;
  protected packageName: string;

  constructor(protected http: HttpClient, protected logger: LoggerService) {}

  protected get pushNotificationsEnabled(): boolean {
    return false;
  }

  protected get hasPermission(): boolean {
    return false;
  }

  // abstract methods
  init(): Promise<void> {
    return;
  }

  protected requestPermission(): Promise<boolean> {
    return;
  }

  protected getToken(): Promise<string> {
    return;
  }

  protected subscribeToEvents() {}

  protected getWallets(): Promise<MeritWalletClient[]> {
    return;
  }

  protected enablePolling() {}

  protected disablePolling() {}

  async enable() {
    const wallets = await this.getWallets();
    this.disablePolling();
    wallets.forEach((walletClient: MeritWalletClient) => {
      this.logger.info('Subscribing to push with: ', walletClient);
      this.subscribe(walletClient);
    });
  }

  async disable() {
    const wallets = await this.getWallets();
    this.enablePolling();
    wallets.forEach((wallet: MeritWalletClient) => {
      this.unsubscribe(wallet);
    });
  }

  async subscribe(walletClient: MeritWalletClient) {
    if (this.pushNotificationsEnabled && this.token) {
      try {
        await walletClient.pushNotificationsSubscribe({
          token: this.token,
          platform: this.platform,
          packageName: this.packageName,
        });
      } catch (err) {
        if (err) {
          this.logger.error(walletClient.name + ': Subscription Push Notifications error. ', JSON.stringify(err));
        } else {
          this.logger.info(walletClient.name + ': Subscription Push Notifications success.');
        }
      }
    }
  }

  async unsubscribe(walletClient: MeritWalletClient) {
    try {
      await walletClient.pushNotificationsUnsubscribe(this.token);
    } catch (err) {
      if (err) {
        this.logger.error(walletClient.name + ': Subscription Push Notifications error. ', JSON.stringify(err));
      } else {
        this.logger.info(walletClient.name + ': Subscription Push Notifications success.');
      }
    }
  }
}
