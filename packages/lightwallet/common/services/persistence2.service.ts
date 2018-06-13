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
  ViewSettingsPrefix = 'app_view_settings_'
}

export enum ViewSettingsKey {
  GetStartedTips = 'get_started_tips',
  recordPassphrase = 'record_passphrase'
}

export interface INotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  email: string;
  smsNotifications: boolean;
  phoneNumber: string;
}

const DEFAULT_NOTIFICATION_SETTINGS: INotificationSettings = {
  email: '',
  emailNotifications: false,
  pushNotifications: true,
  smsNotifications: false,
  phoneNumber: ''
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
    const settings = (await this.storage.get(StorageKey.NotificationSettings)) || {};
    return {
      ... DEFAULT_NOTIFICATION_SETTINGS ,
      ... settings
    };
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

  async cancelEasySend(scriptAddress: string) {
    const easySends = await this.getEasySends();

    const idx = easySends.findIndex(tx => {
      return tx.scriptAddress == scriptAddress;
    });

    if (idx != -1) {
      easySends[idx].cancelled = true;
      console.log('FOUND:', easySends[idx]);
      await this.setEasySends(easySends);
      return true;
    } else {
      console.log('Couldnt find EasySend to cancel', scriptAddress);
      return false;
    }
  }

  setEasySends(easySends: EasySend[]) {
    return this.storage.set(StorageKey.EasySends, easySends);
  }

  async getEasySends(): Promise<EasySend[]> {
    return (await this.storage.get(StorageKey.EasySends)) || [];
  }

  setViewSettings(key: ViewSettingsKey, value: any) {
    return this.storage.set(StorageKey.ViewSettingsPrefix + key, value);
  }

  getViewSettings(key: ViewSettingsKey) {
    return this.storage.get(StorageKey.ViewSettingsPrefix + key);
  }
}
