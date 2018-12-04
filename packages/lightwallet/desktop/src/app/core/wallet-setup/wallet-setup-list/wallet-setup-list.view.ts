import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';

import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IFullGoal, IFullProgress, ProgressStatus } from '@merit/common/models/goals';
import { IRootAppState } from '@merit/common/reducers';
import { SaveGoalSettingsAction, selectGoalSettings, selectGoalsProgress } from '@merit/common/reducers/goals.reducer';
import { selectPrimaryWallet, SetPrimaryWalletAction } from '@merit/common/reducers/interface-preferences.reducer';
import { selectWallets } from '@merit/common/reducers/wallets.reducer';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { getLatestValue } from '@merit/common/utils/observables';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { filter, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-wallet-setup-list',
  templateUrl: './wallet-setup-list.view.html',
  styleUrls: ['./wallet-setup-list.view.sass'],
})
export class WalletSetupListView implements OnInit {
  constructor(
    private store: Store<IRootAppState>,
    private formBuilder: FormBuilder,
    private persistenceService2: PersistenceService2,
  ) {}

  progress$: Observable<IFullProgress> = this.store
    .select(selectGoalsProgress)
    .pipe(filter(progress => !!progress && progress.goals && progress.goals.length > 0));

  private trackerSettings: any;

  toDo$: Observable<IFullGoal[]> = this.progress$.pipe(
    map(progress => progress.goals.filter(goal => goal.status === ProgressStatus.Incomplete)),
  );

  done$: Observable<IFullGoal[]> = this.progress$.pipe(
    map(progress => progress.goals.filter(goal => goal.status === ProgressStatus.Complete)),
  );

  formData: FormGroup = this.formBuilder.group({
    isSetupTrackerEnabled: false,
  });

  wallets$: Observable<DisplayWallet[]> = this.store.select(selectWallets);
  selectedWallet$: Observable<DisplayWallet> = this.store.select(selectPrimaryWallet);

  isConfirmed$: Observable<boolean> = this.selectedWallet$.pipe(
    filter(wallet => !!wallet),
    map((wallet: DisplayWallet) => wallet.confirmed),
  );

  async ngOnInit() {
    this.trackerSettings = await getLatestValue(this.store.select(selectGoalSettings), settings => !!settings);

    this.formData
      .get('isSetupTrackerEnabled')
      .setValue(this.trackerSettings.isSetupTrackerEnabled, { emitEvent: false });

    this.formData.valueChanges.subscribe(({ isSetupTrackerEnabled }) => {
      this.trackerSettings.isSetupTrackerEnabled = isSetupTrackerEnabled;
      this.store.dispatch(new SaveGoalSettingsAction(this.trackerSettings));
    });
  }

  async selectWallet(wallet: DisplayWallet) {
    this.store.dispatch(new SetPrimaryWalletAction(wallet));
  }

  refresh() {
    location.reload();
  }
}
