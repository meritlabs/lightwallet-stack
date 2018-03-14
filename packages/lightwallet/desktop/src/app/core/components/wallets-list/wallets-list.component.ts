import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';

@Component({
  selector: 'wallets-list',
  templateUrl: './wallets-list.component.html',
  styleUrls: ['./wallets-list.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletsListComponent {
  @Input() showButton: boolean = true;
  @Input() wallets: DisplayWallet[];
  @Input() loading: boolean;
}
