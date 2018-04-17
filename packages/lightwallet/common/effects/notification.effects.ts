import { Injectable } from '@angular/core';
import { IRootAppState } from '@merit/common/reducers';
import {
  AddNotificationAction, formatNotification,
  INotification,
  LoadNotificationsAction, MarkNotificationAsReadAction,
  NotificationsActionType,
  SaveNotificationsAction,
  selectNotificationsState,
  UpdateNotificationsAction
} from '@merit/common/reducers/notifications.reducer';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { ToastControllerService } from '../../desktop/src/app/components/toast-notification/toast-controller.service';

@Injectable()
export class NotificationEffects {

  /**
   * Save notifications when we add, clear, delete, or mark notification as read
   * @type {Observable<SaveNotificationsAction>}
   */
  @Effect()
  saveWhenNeeded$: Observable<SaveNotificationsAction> = this.actions$.pipe(
    ofType(NotificationsActionType.Add, NotificationsActionType.Clear, NotificationsActionType.Delete, NotificationsActionType.MarkAsRead, NotificationsActionType.MarkAllAsRead),
    map(() => new SaveNotificationsAction())
  );

  @Effect()
  load$: Observable<UpdateNotificationsAction> = this.actions$.pipe(
    ofType(NotificationsActionType.Load),
    switchMap(() => fromPromise(this.persistenceService.getNotifications())),
    map((notifications: INotification[]) => new UpdateNotificationsAction(notifications))
  );

  @Effect({ dispatch: false })
  save$ = this.actions$.pipe(
    ofType(NotificationsActionType.Save),
    withLatestFrom(this.store.select(selectNotificationsState)),
    map(([action, notifications]) => this.persistenceService.setNotifications(notifications.notifications))
  );

  @Effect({ dispatch: false })
  showToast$ = this.actions$.pipe(
    ofType(NotificationsActionType.Add),
    tap((action: AddNotificationAction) => {
      const notification = formatNotification(action.notification);
      const toast = this.toastCtrl.create({
        title: notification.title,
        text: notification.message,
        status: 'success'
      });

      toast.onDismiss = () => this.store.dispatch(new MarkNotificationAsReadAction(notification.id));
    })
  );

  /**
   * Load notifications from storage on startup
   * @type {Observable<UpdateNotificationsAction>}
   */
  @Effect()
  init$ = of(new LoadNotificationsAction());

  constructor(private actions$: Actions,
              private store: Store<IRootAppState>,
              private persistenceService: PersistenceService2,
              private toastCtrl: ToastControllerService) {
  }
}
