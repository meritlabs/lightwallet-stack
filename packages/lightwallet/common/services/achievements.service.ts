import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { LoadAchivementsAction, GetAuthorizeToken } from '@merit/common/reducers/achivement.reducer';
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
    let profile = await this.persistenceService.getProfile();
    const authData = await MeritAchivementClient.fromObj(profile).login();
    this.store.dispatch(new GetAuthorizeToken(authData.token));
    return authData.token;
  }

  async loadaAchievements() {
    let profile = await this.persistenceService.getProfile(),
      token,
      getWalletAchivements;
    await this.store.select('achievements').subscribe(res => (token = res.token));
    if (token) {
      getWalletAchivements = await MeritAchivementClient.fromObj(profile).getAll(token);
    } else {
      getWalletAchivements = await MeritAchivementClient.fromObj(profile).getAll(await this.getToken());
    }

    this.store.dispatch(new LoadAchivementsAction(getWalletAchivements));
  }
}
