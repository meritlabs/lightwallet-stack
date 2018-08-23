import { Component, Input } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';

@Component({
  selector: 'wallets-list',
  templateUrl: './wallets-list.component.html',
  styleUrls: ['./wallets-list.component.sass'],
})
export class WalletsListComponent {
  @Input() wallets: DisplayWallet[];
  @Input() loading: boolean;

  trackByFn(wallet: DisplayWallet) {
    return wallet.id;
  }
}
