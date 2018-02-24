import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnboardingRoutingModule } from './onboarding-routing.module';
import { OnboardComponent } from './onboard/onboard.component';
import { UnlockComponent } from './unlock/unlock.component';

@NgModule({
  imports: [
    CommonModule,
    OnboardingRoutingModule
  ],
  declarations: [OnboardComponent, UnlockComponent]
})
export class OnboardingModule { }
