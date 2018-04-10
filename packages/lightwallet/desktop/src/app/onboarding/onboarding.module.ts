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
import { SendingMeritComponent } from './onboard/illustations/sending-merit/sending-merit.component';
import { YourWayComponent } from './onboard/illustations/your-way/your-way.component';
import { ThatsItComponent } from './onboard/illustations/thats-it/thats-it.component';

@NgModule({
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxCarouselModule
  ],
  declarations: [OnboardComponent, UnlockComponent, OnboardingRootComponent, WorryFreeComponent, SendingMeritComponent, YourWayComponent, ThatsItComponent]
})
export class OnboardingModule { }
