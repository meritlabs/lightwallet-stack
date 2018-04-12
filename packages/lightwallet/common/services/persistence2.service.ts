import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { EasySend } from '@merit/common/models/easy-send';
import { INotification } from '@merit/common/reducers/notifications.reducer';

export enum StorageKey {
  WalletPreferencesPrefix = 'merit_wallet_preferences_',
  NotificationSettings = 'merit_notification_settings',
  Notifications = 'merit_notifications',
  EasySends = 'merit_easysends'
}

/**
 * New storage service with the goal of minimizing & cleaning up the previous service.
 */
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

  setNotifications(notifications: INotification[]) {
    return this.storage.set(StorageKey.Notifications, notifications);
  }

  getNotifications(): Promise<INotification[]> {
    return this.storage.get(StorageKey.Notifications);
  }

  async addEasySend(easySend: EasySend) {
    const easySends = (await this.getEasySends()) || [];
    easySends.push(easySend);
    return this.setEasySends(easySends);
  }

  setEasySends(easySends: EasySend[]) {
    return this.storage.set(StorageKey.EasySends, easySends);
  }

  getEasySends(): Promise<EasySend[]> {
    return this.storage.get(StorageKey.EasySends);
  }
}
