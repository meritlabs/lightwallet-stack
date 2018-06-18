import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { GoalsService } from '@merit/common/services/goals.service';
import {
  SaveGoalSettingsAction,
  selectGoalSettings,
  UpdateGoalSettingsAction
} from '@merit/common/reducers/goals.reducer';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-welcome-to-setup-tracker',
  templateUrl: './welcome-to-setup-tracker.component.html',
  styleUrls: ['./welcome-to-setup-tracker.component.sass'],
})
export class WelcomeToSetupTrackerComponent {
  constructor(
    private formBuilder: FormBuilder,
    private store: Store<IRootAppState>,
    private router: Router,
    private goalsService: GoalsService
  ) {}

  trackerSettings: any;

  formData: FormGroup = this.formBuilder.group({
    isSetupTrackerEnabled: false,
  });

  async ngOnInit() {
    this.trackerSettings = await this.store.select(selectGoalSettings).pipe(take(1)).toPromise();
    this.formData.get('isSetupTrackerEnabled').setValue(this.trackerSettings.isSetupTrackerEnabled, { emitEvent: false });
  }

  changeTrackerState() {
    this.trackerSettings.isSetupTrackerEnabled = !this.trackerSettings.isSetupTrackerEnabled;
  }

  closeAndSave() {
    this.trackerSettings.isWelcomeDialogEnabled = !this.trackerSettings.isWelcomeDialogEnabled;
    this.store.dispatch(new SaveGoalSettingsAction(this.trackerSettings));
    this.router.navigate(['/wallet-setup']);
  }
}
