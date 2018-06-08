import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { ENV } from '@app/env';
import { IRootAppState } from '@merit/common/reducers';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { MeritMarketClient } from '@merit/common/merit-market-client/api';

@Component({
  selector: 'view-market-login',
  templateUrl: './market-login.view.html',
  styleUrls: ['./market-login.view.sass']
})
export class MarketLoginView implements OnInit {
  error: boolean;

  constructor(private persistenceService: PersistenceService) {}

  ngOnInit() {
    this.login();
  }

  async login() {
    this.error = false;

    let profile = await this.persistenceService.getProfile();

    try {
      const authData = await MeritMarketClient.fromObj(profile).login();

      if (authData.token) {
        // in case we're in a top window just redirect to market
        if (!window.opener) {
          // window.location.replace(`${ENV.marketUrl}?token=${encodeURIComponent(authData.token)}`);
        } else {
          // else we're in a popup and can send token trough postMessage
          const message = JSON.stringify({
            message: "Lightwallet.Market.Auth",
            data: { token: authData.token }
          });
          window.opener.postMessage(message, ENV.marketUrl);
        }
      }
    } catch (e) {
      this.error = true;
    }
  }
}
