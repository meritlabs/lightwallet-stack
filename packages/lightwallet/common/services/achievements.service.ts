import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {
  SetAchievementsAction,
  SetAuthorizeToken,
  SetAchievementsSettings,
  CompleteAchivement,
} from '@merit/common/reducers/achivement.reducer';
import { MeritAchivementClient } from '@merit/common/achievements-client/api';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { ENV } from '@app/env';

@Injectable()
export class achievementsService {
  static BASE_URL: string = `${ENV.achievementApi}/goals/`;

  constructor(
    private http: HttpClient,
    private store: Store<IRootAppState>,
    private persistenceService: PersistenceService
  ) {}

  async getToken() {
    let profile = await this._getProfile(),
      token,
      result;

    await this.store.select('achievements').subscribe(res => (token = res.token));
    if (!token) {
      const authData = await MeritAchivementClient.fromObj(profile).login();
      result = authData.token;
      await this.store.dispatch(new SetAuthorizeToken(authData.token));
    } else {
      result = token;
    }
    return result;
  }

  async getAchievements() {
    let profile = await this._getProfile(),
      getWalletAchivements = await MeritAchivementClient.fromObj(profile).getData(
        await this.getToken(),
        '/achievements/'
      );

    this.store.dispatch(new SetAchievementsAction(getWalletAchivements));
  }

  async getLockedAchievements() {
    let lockedAcievents = [
      {
        id: 'u0',
        goalId: 'u0',
        slug: 0,
        route: 'unlock',
        name: 'Creator',
        description: 'Wallet unlock',
        title: 'Wallet unlock',
        linkTitle: 'Unlock',
        image: 'achi-creator',
        conditions: [{ name: 'Create wallet', status: 1 }, { name: 'Unlock wallet', status: 0 }],
        status: 0,
        version: 0,
      },
    ];

    this.store.dispatch(new SetAchievementsAction(lockedAcievents));
  }

  async getSettings() {
    let profile = await this._getProfile(),
      getAchivementsSettings = await MeritAchivementClient.fromObj(profile).getData(
        await this.getToken(),
        '/settings/'
      );

    this.store.dispatch(new SetAchievementsSettings(getAchivementsSettings));
  }

  async setSettings(settings) {
    let profile = await this._getProfile();
    await MeritAchivementClient.fromObj(profile).setData('/settings/', settings, await this.getToken());
    this.store.dispatch(new SetAchievementsSettings(settings));
  }

  async updateGoal(id, step) {
    let profile = await this._getProfile();
    await MeritAchivementClient.fromObj(profile).setData(
      `/achievements/${id}/step/${step}/complete`,
      {},
      await this.getToken()
    );
    this.store.dispatch(new CompleteAchivement({ id: id, step: step }));
  }

  async reLogin() {
    await this.store.dispatch(new SetAuthorizeToken(null));
    this.getAchievements();
  }

  async _getProfile() {
    let settings: any = this.store.select('interface'),
      profile = await this.persistenceService.getProfile(),
      loginProfile: any = {
        version: '',
        wallets: [],
        credentials: [],
      };
    await settings.subscribe(res => {
      if (profile.credentials.length > 1) {
        profile.credentials.filter((item: any) => {
          if (JSON.parse(item).walletId === res.primaryWallet) {
            loginProfile.version = profile.version;
            loginProfile.credentials = [item];
          }
        });
      } else {
        loginProfile = profile;
      }
    });
    return loginProfile;
  }
}
