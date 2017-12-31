import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

// The onboarding view (component)
@IonicPage({
  segment: 'onboarding'
})
@Component({
  selector: 'view-onboarding',
  templateUrl: 'onboarding.html',
})
export class OnboardingView {}
