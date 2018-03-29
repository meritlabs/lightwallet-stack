import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { IRootAppState } from '@merit/common/reducers';
import { IAppState, selectAppState } from '@merit/common/reducers/app.reducer';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { ProfileService } from '@merit/common/services/profile.service';
import { map } from 'rxjs/operators';

@Injectable()
export class DashboardGuard implements CanActivate {
  constructor(private profileService: ProfileService,
              private router: Router,
              private store: Store<IRootAppState>) {}

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.store.select(selectAppState)
      .pipe(
        map((state: IAppState) => {
          if (state.credentialsLength > 0) {
            return true;
          } else {
            this.router.navigateByUrl('/onboarding/unlock');
            return false;
          }
        })
      );
  }
}
