import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState, getWalletTotals, getWalletsLoading } from '@merit/common/reducers';

@Component({
  selector: 'app-profile-stats',
  templateUrl: './profile-stats.component.html',
  styleUrls: ['./profile-stats.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileStatsComponent {
  @Input() totals: any;
  @Input() loading: boolean;

}
