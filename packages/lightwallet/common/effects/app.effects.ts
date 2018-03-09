import { Injectable } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { UpdateAppAction } from '@merit/common/reducers/app.reducer';
import { RefreshWalletsAction, UpdateWalletsAction } from '@merit/common/reducers/wallets.reducer';
import { ProfileService } from '@merit/common/services/profile.service';
import { Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { of } from 'rxjs/observable/of';
import { mergeMap } from 'rxjs/operator/mergeMap';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class AppEffects {
  @Effect()
  init$: Observable<Action> = defer(() => of(null))
    .pipe(
      switchMap(() => Observable.fromPromise(this.profileService.loadAndBindProfile())),
      switchMap((profile: any) => {
        if (!profile || !profile.credentials || !profile.credentials.length) {
          return [
            new UpdateAppAction({ loading: false })
          ];
        } else {
          return [
            new UpdateAppAction({
              loading: false,
              credentialsLength: profile.credentials.length
            }),
            new RefreshWalletsAction()
          ];
        }
      })
    );

  constructor(private profileService: ProfileService) {}
}
