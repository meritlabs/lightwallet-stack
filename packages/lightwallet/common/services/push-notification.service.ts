import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService } from '@merit/common/services/logger.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';


@Injectable()
export class PushNotificationService {
  protected token;
  protected retriesRemaining: number = 3;

  protected get pushNotificationsEnabled(): boolean {
    return false;
  }

  constructor(protected http: HttpClient,
              protected logger: LoggerService) {}

  // abstract
  async getToken() {}

  subscribe(walletClient: MeritWalletClient) {
    if (this.pushNotificationsEnabled && this.token) {

    }
  }

  unsubscribe(walletClient: MeritWalletClient) {

  }
}
