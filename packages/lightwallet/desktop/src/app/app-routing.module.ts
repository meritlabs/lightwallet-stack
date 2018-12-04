import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, tap } from 'rxjs/operators';

import { DashboardGuard } from '@merit/desktop/app/guards/dashboard.guard';
import { OnboardingGuard } from '@merit/desktop/app/guards/onboarding.guard';
import { AppSettingsService } from '@merit/common/services/app-settings.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { IRootAppState } from '@merit/common/reducers';
import { selectAppState, IAppState } from '@merit/common/reducers/app.reducer';
import { RefreshWalletsAction } from '@merit/common/reducers/wallets.reducer';
import { RateService } from '@merit/common/services/rate.service';

@Injectable()
export class CoreModuleResolver implements Resolve<void> {
  constructor(
    private appService: AppSettingsService,
    private ratesService: RateService,
    private profileService: ProfileService,
    private store: Store<IRootAppState>,
  ) {}

  // resolver here is a hack for lazy loaded CoreModule route
  // TODO: figure out if there is a better place to hook in in module initialization process
  async resolve() {
    await this.appService.getInfo();
    await this.ratesService.loadRates();

    this.store
      .select(selectAppState)
      .pipe(
        filter((state: IAppState) => state.authorized),
        tap((state: IAppState) => this.store.dispatch(new RefreshWalletsAction())),
      )
      .subscribe();
  }
}

const routes: Routes = [
  {
    path: 'onboarding',
    loadChildren: './onboarding/onboarding.module#OnboardingModule',
    canActivate: [OnboardingGuard],
  },
  { path: 'market', loadChildren: './market/market.module#MarketModule', canActivate: [DashboardGuard] },
  {
    path: '',
    loadChildren: './core/core.module#CoreModule',
    canActivate: [DashboardGuard],
    resolve: { init: CoreModuleResolver },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [CoreModuleResolver],
})
export class AppRoutingModule {}
