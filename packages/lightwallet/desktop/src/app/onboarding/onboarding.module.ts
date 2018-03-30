import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { OnboardingRoutingModule } from './onboarding-routing.module';
import { OnboardComponent } from './onboard/onboard.component';
import { UnlockComponent } from './unlock/unlock.component';
import { OnboardingRootComponent } from './onboarding-root/onboarding-root.component';

@NgModule({
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [OnboardComponent, UnlockComponent, OnboardingRootComponent]
})
export class OnboardingModule { }
