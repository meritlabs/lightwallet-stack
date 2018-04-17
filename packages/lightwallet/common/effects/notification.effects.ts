import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { fromPromise } from 'rxjs/observable/fromPromise';
import {
  INotification, LoadNotificationsAction, NotificationsActionType, SaveNotificationsAction,
  selectNotifications,
  UpdateNotificationsAction
} from '@merit/common/reducers/notifications.reducer';
import { map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { LoggerService } from '@merit/common/services/logger.service';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

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
    ofType(NotificationsActionType.Add, NotificationsActionType.Clear, NotificationsActionType.Delete, NotificationsActionType.MarkAsRead),
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
    map(([action, notifications]) => this.persistenceService.setNotifications(notifications))
  );

  constructor(private actions$: Actions,
              private store: Store<IRootAppState>,
              private persistenceService: PersistenceService2,
              private logger: LoggerService) {
  }
}
