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
    filter((action: UpdateAppAction) => action.payload.credentialsLength === 0),
    tap(() => this.router.navigateByUrl('/onboarding'))
  );

  constructor(private actions$: Actions,
              private router: Router) {
  }
}
