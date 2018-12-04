import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { getQueryParam } from '@merit/common/utils/url';

@Injectable()
export class EscrowGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    if (
      /*!window.opener ||*/ !(
        getQueryParam('a') &&
        getQueryParam('pa') &&
        getQueryParam('ea') &&
        getQueryParam('t') &&
        getQueryParam('ids')
      )
    ) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
