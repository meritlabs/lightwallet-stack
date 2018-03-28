import { Injectable } from '@angular/core';
import { UpdateAppAction } from '@merit/common/reducers/app.reducer';
import { RefreshWalletsAction } from '@merit/common/reducers/wallets.reducer';
import { ProfileService } from '@merit/common/services/profile.service';
import { Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { of } from 'rxjs/observable/of';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class AppEffects {
  @Effect()
  init$: Observable<Action> = defer(() => of(null))
    .pipe(
      switchMap(() => Observable.fromPromise(this.profileService.getWallets())),
      switchMap((wallets: any) => {
        if (wallets.length == 0) {
          return [
            new UpdateAppAction({ loading: false })
          ];
        } else {
          return [
            new UpdateAppAction({
              loading: false,
              credentialsLength: wallets.length
            }),
            new RefreshWalletsAction()
          ];
        }
      })
    );

  constructor(private profileService: ProfileService) {
  }
}
