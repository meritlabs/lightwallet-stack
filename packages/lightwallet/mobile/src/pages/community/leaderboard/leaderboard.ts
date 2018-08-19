import { Component, OnInit } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { ProfileService } from '@merit/common/services/profile.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { Observable } from 'rxjs';
import { ILeaderboard } from '@merit/common/models/rank';
import { getLatestValue } from '@merit/common/utils/observables';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';
import { selectWallets } from '../../../../../common/reducers/wallets.reducer';


@IonicPage()
@Component({
  selector: 'view-leaderboard',
  templateUrl: 'leaderboard.html',
})
export class LeaderboardView implements OnInit {

  wallets$: Observable<DisplayWallet[]> = this.store.select(selectWallets);
  leaderboard: ILeaderboard;

  loading: boolean = true;

  constructor(private store: Store<IRootAppState>) {
  }


  async ngOnInit() {
    const wallets: DisplayWallet[] = await getLatestValue(this.wallets$);
    this.leaderboard = await wallets[0].client.getCommunityLeaderboard();
    this.loading = false;
  }
}
