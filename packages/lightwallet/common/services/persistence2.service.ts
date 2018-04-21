import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { EasySend } from '@merit/common/models/easy-send';
import { INotification } from '@merit/common/reducers/notifications.reducer';
import { isEmpty } from 'lodash';

export enum StorageKey {
  WalletPreferencesPrefix = 'merit_wallet_preferences_',
  NotificationSettings = 'merit_notification_settings',
  Notifications = 'merit_notifications',
  EasySends = 'merit_easysends',
  viewSettings = 'app_view_settings'
}

export interface INotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  email: string;
}

const DEFAULT_NOTIFICATION_SETTINGS: INotificationSettings = {
  email: '',
  emailNotifications: false,
  pushNotifications: true
};

/**
 * New storage service with the goal of minimizing & cleaning up the previous service.
 */
@Injectable()
export class PersistenceService2 {
  constructor(private storage: Storage) {}

  saveWalletPreferences(preferences: any) {
    return this.storage.set(StorageKey.WalletPreferencesPrefix + preferences.id, preferences);
  }

  async getWalletPreferences(walletId: string) {
    return (await this.storage.get(StorageKey.WalletPreferencesPrefix + walletId)) || {};
  }

  setNotificationSettings(settings: any) {
    return this.storage.set(StorageKey.NotificationSettings, settings);
  }

  async getNotificationSettings(): Promise<INotificationSettings> {
    const settings = await this.storage.get(StorageKey.NotificationSettings);
    return isEmpty(settings)? DEFAULT_NOTIFICATION_SETTINGS : settings;
  }

  setNotifications(notifications: INotification[]) {
    return this.storage.set(StorageKey.Notifications, notifications);
  }

  async getNotifications(): Promise<INotification[]> {
    return (await this.storage.get(StorageKey.Notifications)) || [];
  }

  async addEasySend(easySend: EasySend) {
    const easySends = await this.getEasySends();
    easySends.push(easySend);
    return this.setEasySends(easySends);
  }

  setEasySends(easySends: EasySend[]) {
    return this.storage.set(StorageKey.EasySends, easySends);
  }

  async getEasySends(): Promise<EasySend[]> {
    return (await this.storage.get(StorageKey.EasySends)) || [];
  }

  setViewSettings(key: string, value: boolean) {
    return this.storage.set(StorageKey.viewSettings + key, value);
  }

  async getViewSettings(key) {
    return this.storage.get(StorageKey.viewSettings + key);
  }
}
