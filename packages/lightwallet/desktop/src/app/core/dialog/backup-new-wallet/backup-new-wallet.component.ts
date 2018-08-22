import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'backup-new-wallet',
  templateUrl: './backup-new-wallet.component.html',
  styleUrls: ['./backup-new-wallet.component.sass']
})

export class BackupNewWallet {
  @Input() wallet;
  @Output() dismiss: EventEmitter<void> = new EventEmitter<void>();

  copy: string = 'COPY';
  showPhrase: boolean = false;
  showNextBtn: boolean = false;

  copyState() {
    this.copy = 'COPIED';
    setTimeout(() => {
      this.copy = 'COPY';
    }, 1000);
    this.showNextBtn=true;
  }
}