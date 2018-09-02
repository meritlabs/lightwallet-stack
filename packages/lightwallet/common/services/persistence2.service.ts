import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { EasySend } from '@merit/common/models/easy-send';
import { INotification } from '@merit/common/reducers/notifications.reducer';
import { isEmpty } from 'lodash';
import { IDisplayTransaction, IVisitedTransaction } from '@merit/common/models/transaction';

export enum StorageKey {
  WalletPreferencesPrefix = 'merit_wallet_preferences_',
  NotificationSettings = 'merit_notification_settings',
  Notifications = 'merit_notifications',
  VisitedTransactions = 'merit_visited_transactions',
  VisitedInvites = 'merit_visited_invites',
  ViewSettingsPrefix = 'app_view_settings_',
  LastIgnoredUpdate = 'last_ignored_update',
  WalletHistory = 'wallet_history_',
  PendingTransactions = 'pending_transactions_',
}

export enum UserSettingsKey {
  GetStartedTips = 'get_started_tips',
  recordPassphrase = 'record_passphrase',
  primaryWalletID = 'primary_wallet_id',
  SmsNotificationsPrompt = 'sms_notifications_prompt'
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
  constructor(private storage: Storage) {
  }

  /**
   * Use this method to set a generic value that doesn't require it's own function
   * @param {StorageKey} key
   * @param value
   * @returns {Promise<any>}
   */
  setValue(key: StorageKey, value: any): Promise<any> {
    return this.storage.set(key, value);
  }

  /**
   * Use this method to set a generic value that doesn't require it's own function
   * @param {StorageKey} key
   * @returns {Promise<any>}
   */
  getValue(key: StorageKey): Promise<any> {
    return this.storage.get(key);
  }

  saveWalletPreferences(preferences: any) {
    return this.storage.set(StorageKey.WalletPreferencesPrefix + preferences.id, preferences);
  }

  async getWalletPreferences(walletId: string) {
    return (await this.storage.get(StorageKey.WalletPreferencesPrefix + walletId)) || {};
  }

  async setNotificationSettings(settings: Partial<INotificationSettings>) {
    return this.storage.set(StorageKey.NotificationSettings, {
      ...await this.getNotificationSettings(),
      ...settings
    });
  }

  async getNotificationSettings(): Promise<INotificationSettings> {
    const settings = (await this.storage.get(StorageKey.NotificationSettings)) || {};
    return {
      ...DEFAULT_NOTIFICATION_SETTINGS,
      ...settings
    };
  }

  setNotifications(notifications: INotification[]) {
    return this.storage.set(StorageKey.Notifications, notifications);
  }

  async getNotifications(): Promise<INotification[]> {
    return (await this.storage.get(StorageKey.Notifications)) || [];
  }

  setUserSettings(key: UserSettingsKey, value: any) {
    return this.storage.set(StorageKey.ViewSettingsPrefix + key, value);
  }

  getUserSettings(key: UserSettingsKey) {
    return this.storage.get(StorageKey.ViewSettingsPrefix + key);
  }

  async resetUserSettings() {
    for (let key in UserSettingsKey) {
      await this.setUserSettings(UserSettingsKey[key] as UserSettingsKey, false);
    }
  }

  async getVisitedTransactions(): Promise<IVisitedTransaction[]> {
    return (await this.storage.get(StorageKey.VisitedTransactions)) || [];
  }

  setVisitedTransactions(transactions: IVisitedTransaction[]) {
    return this.storage.set(StorageKey.VisitedTransactions, transactions);
  }

  async getVisitedInvites(): Promise<string[]> {
    return (await this.storage.get(StorageKey.VisitedInvites)) || [];
  }

  setVisitedInvites(invites: string[]) {
    return this.storage.set(StorageKey.VisitedInvites, invites);
  }

  setHistory(walletId: string, txs: IDisplayTransaction[]) {
    return this.storage.set(StorageKey.WalletHistory + walletId, txs);
  }

  async getHistory(walletId: string): Promise<IDisplayTransaction[]> {
    return (await this.storage.get(StorageKey.WalletHistory + walletId)) || [];
  }

  setPendingTransactions(walletId: string, txs: IDisplayTransaction[]) {
    return this.storage.set(StorageKey.PendingTransactions + walletId, txs);
  }

  async getPendingTransactions(walletId: string): Promise<IDisplayTransaction[]> {
    return (await this.storage.get(StorageKey.PendingTransactions + walletId)) || [];
  }

  async addPendingTransaction(walletId: string, tx: IDisplayTransaction) {
    return this.setPendingTransactions(walletId, [
      tx,
      ...await this.getPendingTransactions(walletId),
    ])
  }
}
