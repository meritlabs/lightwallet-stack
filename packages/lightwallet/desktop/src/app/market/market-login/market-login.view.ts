import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { MeritMarketClient } from '@merit/common/merit-market-client/api';
import { ENV } from '@app/env';

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
        window.location.replace(`${ENV.marketUrl}?token=${encodeURIComponent(authData.token)}`);
      }
    } catch (e) {
      this.error = true;
    }
  }
}
