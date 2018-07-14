import { Component, OnInit } from '@angular/core';

import { ENV } from '@app/env';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { MeritMarketClient } from '@merit/common/merit-market-client/api';

@Component({
  selector: 'view-market-login',
  templateUrl: './market-login.view.html',
  styleUrls: ['./market-login.view.sass'],
})
export class MarketLoginView implements OnInit {
  loadingWallets = false;
  logging: boolean;
  error: boolean;
  selectedWalletIndex = -1;
  profile;

  constructor(private persistenceService: PersistenceService) {}

  async ngOnInit() {
    this.loadingWallets = true;
    this.profile = await this.persistenceService.getProfile();
    this.loadingWallets = false;

    console.log(this.profile.wallets);

    if (this.profile.wallets.length === 1) {
      this.login(0);
    }
  }

  toWallets() {
    this.error = false;
    this.selectedWalletIndex = -1;
  }

  async login(walletIndex: number) {
    this.selectedWalletIndex = walletIndex;
    this.logging = true;

    try {
      const authData = await MeritMarketClient.fromObj(this.profile, walletIndex).login();

      if (authData.token) {
        // else we're in a popup and can send token trough postMessage
        const message = JSON.stringify({
          message: "Lightwallet.Market.Auth",
          data: { token: authData.token }
        });
        window.opener.postMessage(message, ENV.marketUrl);
      }
    } catch (e) {
      this.error = true;
    }

    this.logging = false;
  }
}
