import { Component, OnInit } from '@angular/core';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';

import { Achievements } from '@merit/common/models/achievement';
import { AchievementsService } from '@merit/common/services/achievements.service';

import { FormBuilder, FormGroup } from '@angular/forms';

import { DisplayWallet } from '@merit/common/models/display-wallet';
import { selectWallets } from '@merit/common/reducers/wallets.reducer';
import { InterfacePreferencesService } from '@merit/common/services/interface-preferences.service';
import { PersistenceService2, UserSettingsKey } from '@merit/common/services/persistence2.service';

@Component({
  selector: 'app-wallet-setup-list',
  templateUrl: './wallet-setup-list.view.html',
  styleUrls: ['./wallet-setup-list.view.sass'],
})
export class WalletSetupListView implements OnInit {
  constructor(
    private store: Store<IRootAppState>,
    private AchievementsService: AchievementsService,
    private formBuilder: FormBuilder,
    private persistenceService2: PersistenceService2,
    private InterfacePreferencesService: InterfacePreferencesService
  ) {}

  goalsState$: Observable<Achievements> = this.store.select('achievements');
  trackerSettings: any;
  toDo: any;

  formData: FormGroup = this.formBuilder.group({
    isSetupTrackerEnabled: false,
  });

  wallet: any;
  readiness: number;
  readinessBackground: string;

  wallets: any;
  selectedWallet: any;

  async ngOnInit() {
    await this.store.select('achievements').subscribe(res => {
      this.trackerSettings = res.settings;
      this.formData.patchValue({
        isSetupTrackerEnabled: res.settings.isSetupTrackerEnabled,
      });
    });

    let primaryWallet = await this.persistenceService2.getUserSettings(UserSettingsKey.primaryWalletID);

    await this.store.select(selectWallets).subscribe(res => {
      this.wallets = res;
      this.wallet = res[0];
      res.forEach((item: any) => {
        if (item.id === primaryWallet) this.selectedWallet = item;
      });
    });

    await this.goalsState$.subscribe(res => {
      let toDo = res.achievements.filter((item: any) => item.status === 0),
        complete = res.achievements.length - toDo.length,
        total = res.achievements.length,
        readiness = complete / total * 100;

      this.readiness = parseFloat(readiness.toFixed(2));
      this.readinessBackground = `linear-gradient(to right, #00b0dd ${this.readiness}%, #555b70 ${this.readiness}%)`;

      this.toDo = toDo;
    });
  }
  trackerStatus() {
    this.trackerSettings.isSetupTrackerEnabled = !this.trackerSettings.isSetupTrackerEnabled;
    this.trackerSettings.isWelcomeDialogEnabled = !this.trackerSettings.isWelcomeDialogEnabled;
    this.AchievementsService.setSettings(this.trackerSettings);
  }

  async selectWallet(wallet: DisplayWallet) {
    this.selectedWallet = wallet;
    this.InterfacePreferencesService.setPrimaryWallet(wallet.id);
    await this.AchievementsService.reLogin();
  }
}
