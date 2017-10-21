import { NgModule } from '@angular/core';
import { IonicComponentModule } from 'ionic-angular';
import { OnboardingComponent } from './onboarding';

@NgModule({
  declarations: [
    OnboardingComponent,
  ],
  imports: [
    IonicComponentModule.forChild(OnboardingComponent),
  ],
})
export class OnboardingComponentModule {}
