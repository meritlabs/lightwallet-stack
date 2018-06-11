import { Injectable } from '@angular/core';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';
import { PersistenceService2, UserSettingsKey } from '@merit/common/services/persistence2.service';
import { setPrimaryWallet } from '@merit/common/reducers/interface-preferences.reducer';

@Injectable()
export class InterfacePreferencesService {
  static BASE_URL: string = 'https://testnet.mws.merit.me/achivement-engine/api/v1/goals/';

  constructor(private store: Store<IRootAppState>, private persistenceService2: PersistenceService2) {}

  setPrimaryWallet(walletID) {
    this.persistenceService2.setUserSettings(UserSettingsKey.primaryWalletID, walletID);
    this.store.dispatch(new setPrimaryWallet(walletID));
  }
}
