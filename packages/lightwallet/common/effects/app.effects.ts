import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppReducerActionType, UpdateAppAction } from '@merit/common/reducers/app.reducer';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { filter, tap } from 'rxjs/operators';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { getQueryParam } from '@merit/common/utils/url';

@Injectable()
export class AppEffects {
  // Take the user to the onboarding page if they delete all wallets
  @Effect({ dispatch: false })
  update$ = this.actions$.pipe(
    ofType(AppReducerActionType.UPDATE),
    filter((action: UpdateAppAction) => !action.payload.authorized),
    tap(() => {
      const source = getQueryParam('source');
      if (source.length) {
        this.persistence.setSource(source);
      }

      // working with window.location as router may not be initialized here
      const query = location.search;

      if (query) {
        this.router.navigateByUrl(`/onboarding/${query}`);
      } else if (window.location.pathname.indexOf('/onboarding') !== 0) {
        this.router.navigateByUrl('/onboarding');
      }
    }),
  );

  constructor(private actions$: Actions, private router: Router, private persistence: PersistenceService2) {}
}
