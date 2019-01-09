import { Component, Input } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';

@Component({
  selector: 'app-wallet-unlock-alert',
  templateUrl: './wallet-unlock-alert.component.html',
  styleUrls: ['./wallet-unlock-alert.component.sass'],
})
export class WalletUnlockAlertComponent {
  @Input()
  wallets: DisplayWallet[];
}
