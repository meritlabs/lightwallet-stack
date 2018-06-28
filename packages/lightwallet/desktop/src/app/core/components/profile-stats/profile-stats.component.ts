import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'profile-stats',
  templateUrl: './profile-stats.component.html',
  styleUrls: ['./profile-stats.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileStatsComponent {
  @Input() totals: any;
  @Input() loading: boolean;
  @Input() wallets: Object;
  log(val) {
    console.log(val);
  }
}
