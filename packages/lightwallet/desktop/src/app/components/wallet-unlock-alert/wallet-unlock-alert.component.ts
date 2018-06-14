import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-wallet-unlock-alert',
  templateUrl: './wallet-unlock-alert.component.html',
  styleUrls: ['./wallet-unlock-alert.component.sass'],
})
export class WalletUnlockAlertComponent {
  constructor() {}

  @Input() unActive: number;
}
