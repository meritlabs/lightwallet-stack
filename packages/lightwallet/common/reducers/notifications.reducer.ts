import { Action, createFeatureSelector } from '@ngrx/store';

export interface INotification {
  id: string;
  date: number;
  data: any;
  message: string;
  read: boolean;
}

export type INotificationsState = INotification[];

export enum NotificationsActionType {
  Update = '[Notifications] Update',
  Add = '[Notifications] Add',
  MarkAsRead = '[Notifications] Mark as read',
  Delete = '[Notifications] Delete',
  Clear = '[Notifications] Clear'
}

export class UpdateNotificationsAction implements Action {
  type = NotificationsActionType.Update;

  constructor(public notifications: INotification[]) {
  }
}

export class AddNotificationAction implements Action {
  type = NotificationsActionType.Add;

  constructor(public notification: INotification) {
  }
}

export class MarkNotificationAsReadAction implements Action {
  type = NotificationsActionType.MarkAsRead;

  constructor(public notificationId: string) {
  }
}

export class DeleteNotificationAction implements Action {
  type = NotificationsActionType.Delete;

  constructor(public notificationId: string) {
  }
}

export class ClearNotificationsAction implements Action {
  type = NotificationsActionType.Clear;
}

export type NotificationAction =
  UpdateNotificationsAction
  & AddNotificationAction
  & MarkNotificationAsReadAction
  & DeleteNotificationAction
  & ClearNotificationsAction;

export function notificationsReducer(state: INotificationsState = [], action: NotificationAction): INotificationsState {
  switch (action.type) {
    case NotificationsActionType.Update:
      return action.notifications;

    case NotificationsActionType.Add:
      return [
        ...state,
        action.notification
      ];

    case NotificationsActionType.MarkAsRead:
      state.find((notification: INotification) => notification.id === action.notificationId).read = true;
      return state;

    case NotificationsActionType.Delete:
      return state.filter((notification: INotification) => notification.id !== action.notificationId);

    case NotificationsActionType.Clear:
      return [];

    default:
      return state;
  }
}

export const selectNotifications = createFeatureSelector<INotificationsState>('notifications');
