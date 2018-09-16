import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardGuard } from '@merit/desktop/app/guards/dashboard.guard';
import { OnboardingGuard } from '@merit/desktop/app/guards/onboarding.guard';

const routes: Routes = [
  {
    path: 'onboarding',
    loadChildren: './onboarding/onboarding.module#OnboardingModule',
    canActivate: [OnboardingGuard],
  },
  { path: 'market', loadChildren: './market/market.module#MarketModule', canActivate: [DashboardGuard] },
  { path: '', loadChildren: './core/core.module#CoreModule', canActivate: [DashboardGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
