import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { OnboardingRoutingModule } from './onboarding-routing.module';
import { OnboardView } from './onboard/onboard.view';
import { UnlockComponent } from './unlock/unlock.view';
import { OnboardingRootComponent } from './onboarding-root/onboarding-root.component';
import { NgxCarouselModule } from 'ngx-carousel';
import { CommonPipesModule } from '@merit/common/common-pipes.module';

@NgModule({
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxCarouselModule,
    CommonPipesModule
  ],
  declarations: [OnboardView, UnlockComponent, OnboardingRootComponent]
})
export class OnboardingModule { }
