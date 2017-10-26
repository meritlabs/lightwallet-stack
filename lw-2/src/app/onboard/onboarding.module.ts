import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OnboardingView } from '@app/onboard/onboarding';

@NgModule({
  declarations: [
    OnboardingView,
  ],
  imports: [
    IonicPageModule.forChild(OnboardingView),
  ],
})
export class OnboardingComponentModule {}
