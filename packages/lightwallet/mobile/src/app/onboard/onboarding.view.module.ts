import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OnboardingView } from './onboarding.view';

@NgModule({
  declarations: [OnboardingView],
  imports: [IonicPageModule.forChild(OnboardingView)],
})
export class OnboardingViewModule {}
