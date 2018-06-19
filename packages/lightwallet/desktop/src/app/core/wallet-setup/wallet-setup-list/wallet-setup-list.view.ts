import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';

import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IFullGoal, IFullProgress, ProgressStatus } from '@merit/common/models/goals';
import { IRootAppState } from '@merit/common/reducers';
import { SaveGoalSettingsAction, selectGoalSettings, selectGoalsProgress } from '@merit/common/reducers/goals.reducer';
import { SetPrimaryWalletAction } from '@merit/common/reducers/interface-preferences.reducer';
import { selectWallets } from '@merit/common/reducers/wallets.reducer';
import { GoalsService } from '@merit/common/services/goals.service';
import { PersistenceService2, UserSettingsKey } from '@merit/common/services/persistence2.service';
import { getLatestValue } from '@merit/common/utils/observables';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-wallet-setup-list',
  templateUrl: './wallet-setup-list.view.html',
  styleUrls: ['./wallet-setup-list.view.sass']
})
export class WalletSetupListView implements OnInit {
  constructor(
    private store: Store<IRootAppState>,
    private formBuilder: FormBuilder,
    private persistenceService2: PersistenceService2,
    private goalService: GoalsService
  ) {}

  progress$: Observable<IFullProgress> = this.store.select(selectGoalsProgress);

  trackerSettings: any;

  toDo$: Observable<IFullGoal[]> = this.progress$.pipe(
    map(progress =>
      progress.goals.filter(goal => goal.status === ProgressStatus.Incomplete)
    )
  );

  done$: Observable<IFullGoal[]> = this.progress$.pipe(
    map(progress =>
      progress.goals.filter(goal => goal.status === ProgressStatus.Complete)
    )
  );

  formData: FormGroup = this.formBuilder.group({
    isSetupTrackerEnabled: false
  });

  wallets: DisplayWallet[];
  selectedWallet: DisplayWallet;
  isConfirmed: boolean;

  async ngOnInit() {
    let primaryWallet = await this.persistenceService2.getUserSettings(UserSettingsKey.primaryWalletID);

    const wallets = await getLatestValue(this.store.select(selectWallets), wallets => wallets.length > 0);
    this.wallets = wallets.filter((wallet: DisplayWallet) => wallet.confirmed);

    if (!this.wallets.length) {
      // get locked achievements
    }

    wallets.forEach((wallet: DisplayWallet) => {
      if (!primaryWallet && !wallet.confirmed) {
        this.selectedWallet = wallet;
      } else if (wallet.id === primaryWallet) {
        this.selectedWallet = wallet;
        this.isConfirmed = wallet.confirmed;
      }
    });

    this.trackerSettings = getLatestValue(this.store.select(selectGoalSettings));

    this.formData.patchValue({
      isSetupTrackerEnabled: this.trackerSettings.settings.isSetupTrackerEnabled
    }, { emitEvent: false });
  }

  trackerStatus() {
    this.trackerSettings.isSetupTrackerEnabled = !this.trackerSettings.isSetupTrackerEnabled;
    this.store.dispatch(new SaveGoalSettingsAction(this.trackerSettings));
  }

  async selectWallet(wallet: DisplayWallet) {
    this.selectedWallet = wallet;
    this.store.dispatch(new SetPrimaryWalletAction(wallet.id));
  }

  refresh() {
    location.reload();
  }
}
