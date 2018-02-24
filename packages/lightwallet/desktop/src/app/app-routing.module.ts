import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'onboarding', loadChildren: './onboarding/onboarding.module#OnboardingModule' },
  { path: '', loadChildren: './core/core.module#CoreModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
