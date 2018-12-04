import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { IRootAppState } from '@merit/common/reducers';
import { IAppState, selectAppState } from '@merit/common/reducers/app.reducer';
import { ProfileService } from '@merit/common/services/profile.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Injectable()
export class DashboardGuard implements CanActivate {
  constructor(private profileService: ProfileService, private router: Router, private store: Store<IRootAppState>) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.store.select(selectAppState).pipe(
      map((state: IAppState) => {
        if (state.authorized) {
          return true;
        } else {
          this.router.navigateByUrl('/onboarding/unlock');
          return false;
        }
      }),
    );
  }
}
