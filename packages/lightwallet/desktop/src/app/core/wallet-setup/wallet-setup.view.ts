import { Component, OnInit } from '@angular/core';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { MeritAchivementClient } from '@merit/common/achievements-client/api';
import { MeritMarketClient } from '@merit/common/merit-market-client/api';
import { ENV } from '@app/env';

@Component({
  selector: 'app-wallet-setup',
  templateUrl: './wallet-setup.view.html',
  styleUrls: ['./wallet-setup.view.sass'],
})
export class WalletSetupView implements OnInit {
  constructor(private persistenceService: PersistenceService) {}

  async ngOnInit() {
    let profile = await this.persistenceService.getProfile();

    console.log(profile);

    try {
      const authDataMarket = await MeritMarketClient.fromObj(profile).login();
      console.log(profile);

      console.log(`Market`);
      console.log(authDataMarket);
    } catch (e) {
      console.log(e);
    }

    try {
      const authData = await MeritAchivementClient.fromObj(profile).login();
      console.log(profile);

      console.log(`Achivements: ${authData}`);
    } catch (e) {
      console.log(e);
    }
  }
}
