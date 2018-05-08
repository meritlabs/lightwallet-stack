import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppReducerActionType, UpdateAppAction } from '@merit/common/reducers/app.reducer';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { filter, tap } from 'rxjs/operators';

@Injectable()
export class AppEffects {
  // Take the user to the onboarding page if they delete all wallets
  @Effect({ dispatch: false }) update$ = this.actions$.pipe(
    ofType(AppReducerActionType.UPDATE),
    filter((action: UpdateAppAction) => !action.payload.authorized),
    tap(() => {
      // working with window.location as router may not be initialized here
      // lookup user=aliasoraddress in querystring
      const q = window.location.search;
      const params = q
        .substring(Math.max(0, q.indexOf('?') + 1))
        .split('&')
        .reduce((res, pair) => {
          const q = pair.split('=');
          return { ...res, [q[0]]: q[1]};
        }, {});

      if (params['user']) {
        this.router.navigateByUrl(`/onboarding/unlock?user=${params['user']}`);
      } else if (window.location.pathname.indexOf('/onboarding') !== 0) {
        this.router.navigateByUrl('/onboarding');
      }
    })
  );

  constructor(private actions$: Actions, private router: Router) {
  }
}
