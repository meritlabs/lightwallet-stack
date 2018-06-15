import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { achievementsService } from '@merit/common/services/achievements.service';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-to-setup-tracker',
  templateUrl: './welcome-to-setup-tracker.component.html',
  styleUrls: ['./welcome-to-setup-tracker.component.sass'],
})
export class WelcomeToSetupTrackerComponent {
  constructor(
    private formBuilder: FormBuilder,
    private store: Store<IRootAppState>,
    private achievementsService: achievementsService,
    private router: Router
  ) {}

  trackerSettings: any;

  formData: FormGroup = this.formBuilder.group({
    isSetupTrackerEnabled: false,
  });

  async ngOnInit() {
    await this.store.select('achievements').subscribe(res => {
      this.trackerSettings = res.settings;
      this.formData.patchValue({
        isSetupTrackerEnabled: res.settings.isSetupTrackerEnabled,
      });
    });
  }

  changeTrackerState() {
    this.trackerSettings.isSetupTrackerEnabled = !this.trackerSettings.isSetupTrackerEnabled;
  }

  closeAndSave() {
    this.router.navigate([`/wallet-setup`]);
    this.trackerSettings.isWelcomeDialogEnabled = !this.trackerSettings.isWelcomeDialogEnabled;
    this.achievementsService.setSettings(this.trackerSettings);
  }
}
