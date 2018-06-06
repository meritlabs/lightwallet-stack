import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-welcome-to-setup-tracker',
  templateUrl: './welcome-to-setup-tracker.component.html',
  styleUrls: ['./welcome-to-setup-tracker.component.sass'],
})
export class WelcomeToSetupTrackerComponent {
  constructor(private formBuilder: FormBuilder) {}

  formData: FormGroup = this.formBuilder.group({
    trackerStatus: true,
  });
}
