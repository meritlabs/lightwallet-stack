import { Component, OnInit } from '@angular/core';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { MeritAchivementClient } from '@merit/common/achievements-client/api';
import { MeritMarketClient } from '@merit/common/merit-market-client/api';
import { ENV } from '@app/env';

@Component({
  selector: 'app-quests',
  templateUrl: './quests.view.html',
  styleUrls: ['./quests.view.sass'],
})
export class QuestsView implements OnInit {
  constructor(private persistenceService: PersistenceService) {}

  async ngOnInit() {
    let profile = await this.persistenceService.getProfile();

    console.log(profile);

    try {
      const authData = await MeritAchivementClient.fromObj(profile).login();

      console.log(authData);
    } catch (e) {
      console.log(e);
    }
  }
}
