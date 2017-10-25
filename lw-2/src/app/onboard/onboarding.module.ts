import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OnboardingComponent } from './onboarding';

@NgModule({
  declarations: [
    OnboardingComponent,
  ],
  imports: [
    IonicPageModule.forChild(OnboardingComponent),
  ],
})
export class OnboardingComponentModule {}
