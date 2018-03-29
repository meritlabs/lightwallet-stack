import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnlockComponent } from './unlock/unlock.component';

const routes: Routes = [
  // { path: '', component: OnboardComponent, pathMatch: 'full' },
  { path: '', redirectTo: 'unlock', pathMatch: 'full' }, // temporary until the onboarding page is done
  { path: 'unlock', component: UnlockComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class OnboardingRoutingModule {}
