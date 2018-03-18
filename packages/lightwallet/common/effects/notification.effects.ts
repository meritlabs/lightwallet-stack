import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { fromPromise } from 'rxjs/observable/fromPromise';
import {
  INotification,
  selectNotifications,
  UpdateNotificationsAction
} from '@merit/common/reducers/notifications.reducer';
import { map, switchMap, tap } from 'rxjs/operators';
import { LoggerService } from '@merit/common/services/logger.service';

@Injectable()
export class NotificationEffects {
  @Effect()
  init$ = fromPromise(this.persistenceService.getNotifications())
    .pipe(
      map((notifications: INotification[]) => new UpdateNotificationsAction(notifications || []))
    );

  @Effect({ dispatch: false })
  update$ = this.actions$.pipe(
    switchMap(() => this.store.select(selectNotifications)),
    tap(() => this.logger.info('Saving notifications to storage')),
    map((notifications: INotification[]) => this.persistenceService.setNotifications(notifications))
  );

  constructor(private actions$: Actions,
              private store: Store<IRootAppState>,
              private persistenceService: PersistenceService2,
              private logger: LoggerService) {
  }
}
