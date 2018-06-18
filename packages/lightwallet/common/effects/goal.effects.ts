import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { GoalAction } from '@merit/common/reducers/goals.reducer';
import { of } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';

@Injectable()
export class GoalEffects {

  @Effect()
  init$: Observable<GoalAction> = of({})
    .pipe(
      switchMap(() =>
        fromPromise(

        )
      )
    )

  constructor(private actions$: Actions) {}
}
