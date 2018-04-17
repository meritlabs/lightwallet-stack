import { Injectable } from '@angular/core';
import { IRootAppState } from '@merit/common/reducers';
import {
  INotification,
  LoadNotificationsAction,
  NotificationsActionType,
  SaveNotificationsAction,
  selectNotifications,
  UpdateNotificationsAction
} from '@merit/common/reducers/notifications.reducer';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class NotificationEffects {
  /**
   * Load notifications from storage on startup
   * @type {Observable<UpdateNotificationsAction>}
   */
  @Effect()
  init$ = of(new LoadNotificationsAction());

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
    withLatestFrom(this.store.select(selectNotifications)),
    map(([action, notifications]) => this.persistenceService.setNotifications(notifications.notifications))
  );

  constructor(private actions$: Actions,
              private store: Store<IRootAppState>,
              private persistenceService: PersistenceService2) {
  }
}
