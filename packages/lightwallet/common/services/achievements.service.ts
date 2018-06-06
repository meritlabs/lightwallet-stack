import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';
import { Quests, Quest } from '@merit/common/models/quest';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { LoadQuestsAction } from '@merit/common/reducers/quests.reducer';
import { MeritAchivementClient } from '@merit/common/achievements-client/api';
import { PersistenceService } from '@merit/common/services/persistence.service';

@Injectable()
export class AchievementsService {
  static BASE_URL: string = 'https://testnet.mws.merit.me/achivement-engine/api/v1/goals/';

  constructor(
    private http: HttpClient,
    private store: Store<IRootAppState>,
    private persistenceService: PersistenceService
  ) {}

  async loadaAchievements() {
    let profile = await this.persistenceService.getProfile();

    try {
      const authData = await MeritAchivementClient.fromObj(profile).login(),
        getWalletAchivements = await MeritAchivementClient.fromObj(profile).getAll(authData.token);
      this.store.dispatch(new LoadQuestsAction(getWalletAchivements));
    } catch (e) {
      console.log(e);
    }
  }
}
