import { formatAmount } from '@merit/common/utils/format';
import { Action, createFeatureSelector, createSelector } from '@ngrx/store';
import { sortBy, uniq, random, compact } from 'lodash';

export interface INotification {
  timestamp: number;
  read: boolean;
  address: string;
  copayerId: string;
  id: string;
  isInvite: boolean;
  txid: string;
  type: string;
  walletId: string;
  formatted: boolean;
  title: string;
  message: string;
  [key: string]: any;
}

export interface INotificationsState {
  notifications: INotification[];
  totalUnread: number;
}

export enum NotificationsActionType {
  Update = '[Notifications] Update',
  Add = '[Notifications] Add',
  MarkAsRead = '[Notifications] Mark as read',
  Delete = '[Notifications] Delete',
  Clear = '[Notifications] Clear',
  Load = '[Notifications] Load',
  Save = '[Notifications] Save',
  MarkAllAsRead = '[Notifications] Mark all as read',
}

export class LoadNotificationsAction implements Action {
  type = NotificationsActionType.Load;
}

/**
 * Save state to storage
 */
export class SaveNotificationsAction implements Action {
  type = NotificationsActionType.Save;
}

/**
 * Update notifications in state
 */
export class UpdateNotificationsAction implements Action {
  type = NotificationsActionType.Update;

  constructor(public notifications: INotification[]) {}
}

/**
 * Add a notification
 */
export class AddNotificationAction implements Action {
  type = NotificationsActionType.Add;

  constructor(public notification: INotification) {
    if (!notification.id) {
      this.notification.id = notification.txid || String(random(0, 1000000000));
    }
  }
}

/**
 * Mark notification as read
 */
export class MarkNotificationAsReadAction implements Action {
  type = NotificationsActionType.MarkAsRead;

  constructor(public notificationId: string) {}
}

/**
 * Delete notification
 */
export class DeleteNotificationAction implements Action {
  type = NotificationsActionType.Delete;

  constructor(public notificationId: string) {}
}

/**
 * Clear all notifications
 */
export class ClearNotificationsAction implements Action {
  type = NotificationsActionType.Clear;
}

export class MarkAllNotificationsAsReadAction implements Action {
  type = NotificationsActionType.MarkAllAsRead;
}

export type NotificationAction = UpdateNotificationsAction &
  AddNotificationAction &
  MarkNotificationAsReadAction &
  DeleteNotificationAction &
  ClearNotificationsAction;

export function calculateUnreadNotifications(notifications: INotification[]): number {
  return notifications.reduce((total: number, notification: INotification) => total + Number(!notification.read), 0);
}

export function processNotifications(notifications: INotification[]): INotification[] {
  return sortBy(uniq(compact(notifications.map(formatNotification))), 'timestamp').reverse();
}

export function formatNotification(notification: INotification): INotification {
  if (!notification.formatted) {
    switch (notification.type) {
      case 'IncomingTx':
        notification.title = 'New payment received';
        notification.message = `A payment of ${formatAmount(
          notification.amount,
          'mrt',
        )}MRT has been received into your wallet.`;
        break;

      case 'IncomingInvite':
        notification.title = 'New invite received';
        notification.message = 'An invite has been received into your wallet.';
        break;

      case 'WalletUnlocked':
        notification.title = 'Wallet unlocked';
        notification.message = 'Your wallet was unlocked by incoming invite.';
        break;

      case 'IncomingCoinbase':
        notification.title = 'Mining reward received';
        notification.message = `Congratulations! You received a mining reward of ${formatAmount(
          notification.amount,
          'mrt',
        )}MRT.`;
        break;

      case 'IncomingInviteRequest':
        notification.title = 'New invite request received';
        notification.text = 'An invite has been requested from your wallet.';
        break;

      case 'MinedInvite':
        notification.title = 'Invite mined';
        notification.text = 'Congratulations! You have mined an invite token.';
        break;

      default:
        return null;
    }

    notification.formatted = true;
  }

  return notification;
}

export function notificationsReducer(
  state: INotificationsState = {
    notifications: [],
    totalUnread: 0,
  },
  action: NotificationAction,
): INotificationsState {
  switch (action.type) {
    case NotificationsActionType.Update:
      return {
        notifications: processNotifications(action.notifications),
        totalUnread: calculateUnreadNotifications(action.notifications),
      };

    case NotificationsActionType.Add:
      state.notifications.push(action.notification);
      return {
        notifications: processNotifications(state.notifications),
        totalUnread: state.totalUnread + Number(!action.notification.read),
      };

    case NotificationsActionType.MarkAsRead:
      state.notifications.find((notification: INotification) => notification.id === action.notificationId).read = true;
      return {
        notifications: state.notifications,
        totalUnread: state.totalUnread - 1,
      };

    case NotificationsActionType.MarkAllAsRead:
      return {
        notifications: state.notifications.map((notification: INotification) => {
          notification.read = true;
          return notification;
        }),
        totalUnread: 0,
      };

    case NotificationsActionType.Delete:
      state.notifications = state.notifications.filter(
        (notification: INotification) => notification.id !== action.notificationId,
      );
      return {
        notifications: state.notifications,
        totalUnread: calculateUnreadNotifications(state.notifications),
      };

    case NotificationsActionType.Clear:
      return {
        notifications: [],
        totalUnread: 0,
      };

    default:
      return state;
  }
}

export const selectNotificationsState = createFeatureSelector<INotificationsState>('notifications');
export const selectNotifications = createSelector(selectNotificationsState, state => state.notifications);
export const selectTotalUnreadNotifications = createSelector(selectNotificationsState, state => state.totalUnread);
