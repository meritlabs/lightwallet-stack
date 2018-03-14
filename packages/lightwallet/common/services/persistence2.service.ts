import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

export enum StorageKey {
  WalletPreferencesPrefix = 'merit_wallet_preferences_',
  NotificationSettings = 'merit_notification_settings'
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

  setNotificationSettings(settings: any) {
    return this.storage.set(StorageKey.NotificationSettings, settings);
  }

  getNotificationSettings() {
    return this.storage.get(StorageKey.NotificationSettings);
  }
}
