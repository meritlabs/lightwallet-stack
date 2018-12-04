import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wallet-icon',
  templateUrl: './wallet-icon.component.html',
  styleUrls: ['./wallet-icon.component.scss'],
})
export class WalletIconComponent {
  @Input()
  strokeColor: string;
}
