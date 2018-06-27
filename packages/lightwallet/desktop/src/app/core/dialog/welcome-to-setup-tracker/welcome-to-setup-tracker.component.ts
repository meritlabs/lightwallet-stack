import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { GoalsService } from '@merit/common/services/goals.service';
import { SaveGoalSettingsAction, selectGoalSettings } from '@merit/common/reducers/goals.reducer';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-welcome-to-setup-tracker',
  templateUrl: './welcome-to-setup-tracker.component.html',
  styleUrls: ['./welcome-to-setup-tracker.component.sass'],
})
export class WelcomeToSetupTrackerComponent {
  @Output()
  close: EventEmitter<void> = new EventEmitter<void>();

  trackerSettings: any;
  formData: FormGroup = this.formBuilder.group({
    isSetupTrackerEnabled: false,
  });

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<IRootAppState>,
    private router: Router,
    private goalsService: GoalsService
  ) {}

  async ngOnInit() {
    this.trackerSettings = await this.store.select(selectGoalSettings).pipe(take(1)).toPromise();
    this.formData.get('isSetupTrackerEnabled').setValue(this.trackerSettings.isSetupTrackerEnabled, { emitEvent: false });
  }

  closeAndSave() {
    this.trackerSettings.isWelcomeDialogEnabled = false;
    this.store.dispatch(new SaveGoalSettingsAction(this.trackerSettings));
    this.close.emit();
    this.router.navigate(['/wallet-setup']);
  }
}
