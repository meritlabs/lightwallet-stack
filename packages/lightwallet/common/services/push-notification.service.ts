import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { LoggerService } from '@merit/common/services/logger.service';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';
import { getLatestValue } from '@merit/common/utils/observables';
import { selectWallets } from '@merit/common/reducers/wallets.reducer';

@Injectable()
export class PushNotificationsService {
  protected token: string;
  protected platform: string;
  protected packageName: string;

  constructor(
    protected http: HttpClient,
    protected logger: LoggerService,
    protected store: Store<IRootAppState>) {}

  protected get pushNotificationsEnabled(): boolean {
    return false;
  }

  protected get hasPermission(): boolean {
    return false;
  }

  // abstract methods
  init(): Promise<void> { return; }

  protected requestPermission(): Promise<boolean> { return; }

  protected getToken(): Promise<string> { return; }

  protected subscribeToEvents() {}

  protected async getWallets(): Promise<MeritWalletClient[]> {
    const wallets = await getLatestValue(this.store.select(selectWallets), wallets => wallets && wallets.length > 0);
    return wallets.map(wallet => wallet.client);
  }

  protected enablePolling() {}

  protected disablePolling() {}

  async enable() {
    const wallets = await this.getWallets();
    this.disablePolling();
    wallets.forEach((walletClient: MeritWalletClient) => this.subscribe(walletClient));
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
          packageName: this.packageName
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
