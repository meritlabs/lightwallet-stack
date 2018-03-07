import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';

@Component({
  selector: 'wallets-list',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletsListComponent {
  @Input() showButton: boolean = true;
  @Input() wallets: DisplayWallet[];
  @Input() loading: boolean;
}
