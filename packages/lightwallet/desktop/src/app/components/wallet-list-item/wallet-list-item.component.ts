import { Component, Input } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';

@Component({
  selector: 'wallet-list-item',
  templateUrl: './wallet-list-item.component.html',
  styleUrls: ['./wallet-list-item.component.sass'],
  host: {
    '[class.locked]': 'wallet && !wallet.confirmed'
  }
})
export class WalletListItemComponent {
  @Input() wallet: DisplayWallet;
}
