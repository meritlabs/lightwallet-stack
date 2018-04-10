import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { OnboardingRoutingModule } from './onboarding-routing.module';
import { OnboardComponent } from './onboard/onboard.component';
import { UnlockComponent } from './unlock/unlock.view';
import { OnboardingRootComponent } from './onboarding-root/onboarding-root.component';
import { NgxCarouselModule } from 'ngx-carousel';
import { WorryFreeComponent } from './onboard/illustations/worry-free/worry-free.component';

@NgModule({
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxCarouselModule
  ],
  declarations: [OnboardComponent, UnlockComponent, OnboardingRootComponent, WorryFreeComponent]
})
export class OnboardingModule { }
