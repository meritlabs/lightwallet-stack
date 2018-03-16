import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService } from '@merit/common/services/logger.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';

@Injectable()
export class PushNotificationsService {
  protected token;

  protected get pushNotificationsEnabled(): boolean {
    return false;
  }

  protected get hasPermission(): boolean {
    return false;
  }

  constructor(protected http: HttpClient,
              protected logger: LoggerService) {}

  // abstract methods
  protected init(): Promise<void> { return; }
  protected requestPermission(): Promise<boolean> { return; }
  protected getToken(): Promise<string> { return; }
  protected subscribeToEvents() {}
  protected getWallets(): Promise<MeritWalletClient[]> { return; }

  async enable() {
    const wallets = await this.getWallets();
    this.logger.warn('Got Wallets: ', wallets);
    wallets.forEach((walletClient: MeritWalletClient) => {
      this.logger.warn('Subscribing to push with: ', walletClient);
      this.subscribe(walletClient);
      // We should be handling real-time updates to the application through either data push or
      // through long-polling, but not both.
      // this.pollingNotificationService.disablePolling(walletClient);
      // TODO(ibby): make sure this is implemented elsewhere
    });
  }

  async disable() {
    const wallets = await this.getWallets();
    wallets.forEach((wallet: MeritWalletClient) => {
      this.unsubscribe(wallet);
      // We should be handling real-time updates to the application through either data push or
      // through long-polling, but not both.
      // this.pollingNotificationService.enablePolling(walletClient);
      // TODO(ibby): Handle this elsewhere if possible
    });
    this.token = void 0;
  }

  async subscribe(walletClient: MeritWalletClient) {
    console.log('Subscribing to push notifications of wallet ', walletClient, this.pushNotificationsEnabled, this.token);
    if (this.pushNotificationsEnabled && this.token) {
      try {
        await walletClient.pushNotificationsSubscribe({ token: this.token })
      } catch(err) {
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
      await walletClient.pushNotificationsUnsubscribe(this.token)
    } catch(err) {
      if (err) {
        this.logger.error(walletClient.name + ': Subscription Push Notifications error. ', JSON.stringify(err));
      } else {
        this.logger.info(walletClient.name + ': Subscription Push Notifications success.');
      }
    }
  }
}
