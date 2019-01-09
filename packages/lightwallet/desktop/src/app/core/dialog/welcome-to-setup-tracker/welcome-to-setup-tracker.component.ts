import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { GoalsService } from '@merit/common/services/goals.service';
import { SaveGoalSettingsAction, selectGoalSettings } from '@merit/common/reducers/goals.reducer';
import { IGoalSettings } from '@merit/common/models/goals';

@Component({
  selector: 'app-welcome-to-setup-tracker',
  templateUrl: './welcome-to-setup-tracker.component.html',
  styleUrls: ['./welcome-to-setup-tracker.component.sass'],
})
export class WelcomeToSetupTrackerComponent {
  trackerSettings: IGoalSettings = {
    isWelcomeDialogEnabled: false,
    isSetupTrackerEnabled: true,
  };

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<IRootAppState>,
    private router: Router,
    private goalsService: GoalsService,
  ) {}

  closeAndSave() {
    this.store.dispatch(new SaveGoalSettingsAction(this.trackerSettings));
    this.router.navigate(['/wallet-setup']);
  }
}
