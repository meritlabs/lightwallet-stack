import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { isEmpty } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { ProfileService } from '@merit/common/services/profile.service';

@Injectable()
export class DashboardGuard implements CanActivate {
  constructor(private profileService: ProfileService,
              private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!isEmpty(this.profileService.getProfile()))
      return true;

    this.router.navigateByUrl('/onboarding/unlock');
  }
}
