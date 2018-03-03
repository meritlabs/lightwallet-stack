import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';


@Injectable()
export class WalletEffects {
  @Effect()
  update$: Observable<Action> = this.actions$.pipe(
    ofType(),
    mergeMap(action => {

    });
  );

  constructor(private actions$: Actions) {}
}
