import { Injectable } from '@angular/core';
import { AppReducerActionType, UpdateAppAction } from '@merit/common/reducers/app.reducer';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { filter, tap } from 'rxjs/operators';
import { getQueryParam } from '@merit/common/utils/url';
import { App } from 'ionic-angular';

@Injectable()
export class MobileAppEffects {
  // Take the user to the onboarding page if they delete all wallets
  @Effect({ dispatch: false }) update$ = this.actions$.pipe(
    ofType(AppReducerActionType.UPDATE),
    filter((action: UpdateAppAction) => !action.payload.authorized),
    tap(() => {
      // working with window.location as router may not be initialized here
      // lookup invite=aliasoraddress in querystring
      const invite = getQueryParam('invite');

      const nav = this.app.getActiveNav();

      if (invite) {
        nav.setRoot('unlock', { invite });
      } else if (window.location.pathname.indexOf('/onboarding') !== 0) {
        nav.setRoot('onboarding');
      }
    }),
  );

  constructor(private actions$: Actions, private app: App) {
  }
}
