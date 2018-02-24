import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnboardComponent } from './onboard/onboard.component';
import { UnlockComponent } from './unlock/unlock.component';

const routes: Routes = [
  { path: '', component: OnboardComponent, pathMatch: 'full' },
  { path: 'unlock', component: UnlockComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardingRoutingModule { }
