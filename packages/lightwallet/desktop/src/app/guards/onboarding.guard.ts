import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ProfileService } from '@merit/common/services/profile.service';
import { isEmpty } from 'lodash';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class OnboardingGuard implements CanActivate {
  constructor(private profileService: ProfileService,
              private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (isEmpty(this.profileService.getProfile()))
      return true;

    this.router.navigateByUrl('/dashboard');
  }
}
