import { Action, createFeatureSelector } from '@ngrx/store';

export interface INotification {
  timestamp: number;
  read: boolean;
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
  MarkAllAsRead = '[Notifications] Mark all as read'
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

  constructor(public notifications: INotification[]) {
  }
}

/**
 * Add a notification
 */
export class AddNotificationAction implements Action {
  type = NotificationsActionType.Add;

  constructor(public notification: INotification) {
  }
}

/**
 * Mark notification as read
 */
export class MarkNotificationAsReadAction implements Action {
  type = NotificationsActionType.MarkAsRead;

  constructor(public notificationId: string) {
  }
}

/**
 * Delete notification
 */
export class DeleteNotificationAction implements Action {
  type = NotificationsActionType.Delete;

  constructor(public notificationId: string) {
  }
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

export type NotificationAction =
  UpdateNotificationsAction
  & AddNotificationAction
  & MarkNotificationAsReadAction
  & DeleteNotificationAction
  & ClearNotificationsAction;

export function calculateUnreadNotifications(notifications: INotification[]): number {
  return notifications.reduce((total: number, notification: INotification) => total + Number(notification.read), 0);
}

export function notificationsReducer(state: INotificationsState = { notifications: [], totalUnread: 0 }, action: NotificationAction): INotificationsState {
  switch (action.type) {
    case NotificationsActionType.Update:
      return {
        notifications: action.notifications,
        totalUnread: calculateUnreadNotifications(action.notifications)
      };

    case NotificationsActionType.Add:
      state.notifications.push(action.notification);
      return {
        notifications: state.notifications,
        totalUnread: state.totalUnread + Number(action.notification.read)
      };

    case NotificationsActionType.MarkAsRead:
      state.notifications.find((notification: INotification) => notification.id === action.notificationId).read = true;
      return state;

    case NotificationsActionType.MarkAllAsRead:
      return {
        notifications: state.notifications.map((notification: INotification) => {
          notification.read = true;
          return notification;
        }),
        totalUnread: 0
      };

    case NotificationsActionType.Delete:
      state.notifications = state.notifications.filter((notification: INotification) => notification.id !== action.notificationId);
      return {
        notifications: state.notifications,
        totalUnread: calculateUnreadNotifications(state.notifications)
      };

    case NotificationsActionType.Clear:
      return {
        notifications: [],
        totalUnread: 0
      };

    default:
      return state;
  }
}

export const selectNotifications = createFeatureSelector<INotificationsState>('notifications');
