import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {
  LoadAchivementsAction,
  GetAuthorizeTokenAction,
  GetAchivementsSettingsAction,
} from '@merit/common/reducers/achivement.reducer';
import { MeritAchivementClient } from '@merit/common/achievements-client/api';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { filter, map, take } from 'rxjs/operators';

@Injectable()
export class AchievementsService {
  static BASE_URL: string = 'https://testnet.mws.merit.me/achivement-engine/api/v1/goals/';

  constructor(
    private http: HttpClient,
    private store: Store<IRootAppState>,
    private persistenceService: PersistenceService
  ) {}

  async getToken() {
    let profile = await this.persistenceService.getProfile(),
      token,
      result;
    await this.store.select('achievements').subscribe(res => (token = res.token));
    if (!token) {
      const authData = await MeritAchivementClient.fromObj(profile).login();
      result = authData.token;
      await this.store.dispatch(new GetAuthorizeTokenAction(authData.token));
    } else {
      result = token;
    }
    return result;
  }

  async getAchievements() {
    let profile = await this.persistenceService.getProfile(),
      getWalletAchivements = await MeritAchivementClient.fromObj(profile).getData(
        await this.getToken(),
        '/achievements/'
      );

    this.store.dispatch(new LoadAchivementsAction(getWalletAchivements));
  }

  async getSettings() {
    let profile = await this.persistenceService.getProfile(),
      getAchivementsSettings = await MeritAchivementClient.fromObj(profile).getData(
        await this.getToken(),
        '/settings/'
      );

    console.log(getAchivementsSettings);

    this.store.dispatch(new GetAchivementsSettingsAction(getAchivementsSettings));
  }
}
