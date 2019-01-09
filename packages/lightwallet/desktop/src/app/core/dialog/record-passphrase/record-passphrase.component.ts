import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';

@Component({
  selector: 'app-record-passphrase',
  templateUrl: './record-passphrase.component.html',
  styleUrls: ['./record-passphrase.component.sass'],
})
export class RecordPassphraseComponent {
  constructor() {}

  @Input()
  wallets: DisplayWallet[];
  @Output()
  dismiss: EventEmitter<void> = new EventEmitter<void>();
  copy: string = 'COPY';
  showPhrase: boolean = false;
  showNextBtn: boolean = false;

  copyState() {
    this.copy = 'COPIED';
    setTimeout(() => {
      this.copy = 'COPY';
    }, 1000);
    this.showNextBtn = true;
  }
}
