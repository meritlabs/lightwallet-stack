import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

export enum StorageKey {
  WalletPreferencesPrefix = 'merit_wallet_preferences_'
}

@Injectable()
export class PersistenceService2 {
  constructor(private storage: Storage) {}

  saveWalletPreferences(preferences: any) {
    return this.storage.set(StorageKey.WalletPreferencesPrefix + preferences.id, preferences);
  }

  getWalletPreferences(walletId: string) {
    return this.storage.get(StorageKey.WalletPreferencesPrefix + walletId);
  }
}
