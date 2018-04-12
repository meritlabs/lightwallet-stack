import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { OnboardingRoutingModule } from './onboarding-routing.module';
import { OnboardView } from './onboard/onboard.view';
import { UnlockComponent } from './unlock/unlock.view';
import { OnboardingRootComponent } from './onboarding-root/onboarding-root.component';
import { NgxCarouselModule } from 'ngx-carousel';
import { WorryFreeComponent } from './onboard/illustations/worry-free/worry-free.component';
import { SendingMeritComponent } from './onboard/illustations/sending-merit/sending-merit.component';
import { YourWayComponent } from './onboard/illustations/your-way/your-way.component';
import { ThatsItComponent } from './onboard/illustations/thats-it/thats-it.component';
import { CommonPipesModule } from '@merit/common/common-pipes.module';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

@NgModule({
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxCarouselModule,
    CommonPipesModule,
    Ng4LoadingSpinnerModule
  ],
  declarations: [OnboardView, UnlockComponent, OnboardingRootComponent, WorryFreeComponent, SendingMeritComponent, YourWayComponent, ThatsItComponent]
})
export class OnboardingModule { }
