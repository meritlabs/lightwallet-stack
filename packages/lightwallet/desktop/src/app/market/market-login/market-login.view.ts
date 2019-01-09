import { Component, OnInit } from '@angular/core';

import { ENV } from '@app/env';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { MeritMarketClient } from '@merit/common/merit-market-client/api';
import { PasswordPromptController } from '@merit/desktop/app/components/password-prompt/password-prompt.controller';

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

  constructor(private persistenceService: PersistenceService, private passwordPromptCtrl: PasswordPromptController) {}

  async ngOnInit() {
    this.loadingWallets = true;
    this.profile = await this.persistenceService.getProfile();
    this.loadingWallets = false;

    if (this.profile.wallets.length === 1) {
      this.login(0);
    }
  }

  toWallets() {
    this.error = false;
    this.selectedWalletIndex = -1;
  }

  login(walletIndex: number) {
    const client = MeritMarketClient.fromObj(this.profile, walletIndex);

    if (client.credentials.isPrivKeyEncrypted()) {
      this.passwordPromptCtrl.createForWallet(client).onDidDismiss((password: string) => {
        this.selectedWalletIndex = walletIndex;
        if (password) {
          this.loginWithPassword(client, password);
        } else {
          this.error = true;
        }
      });
    } else {
      this.selectedWalletIndex = walletIndex;
      this.loginWithPassword(client);
    }
  }

  async loginWithPassword(client: any, password?: string) {
    this.logging = true;
    try {
      const authData = await client.login(password);

      if (authData.token) {
        const message = JSON.stringify({
          message: 'Lightwallet.Market.Auth',
          data: { token: authData.token },
        });
        window.opener.postMessage(message, ENV.marketUrl);
      }
    } catch (e) {
      this.error = true;
    }
    this.logging = false;
  }
}
