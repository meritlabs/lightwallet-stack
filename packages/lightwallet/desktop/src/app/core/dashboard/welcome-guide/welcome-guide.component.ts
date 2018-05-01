import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';

@Component({
  selector: 'app-welcome-guide',
  templateUrl: './welcome-guide.component.html',
  styleUrls: ['./welcome-guide.component.sass']
})

export class WelcomeGuideComponent {
  @Input() wallets: DisplayWallet[];
  @Output() dismiss: EventEmitter<void> = new EventEmitter<void>();
  copy: string = 'COPY';
  showPhrase: boolean;

  copyState() {
    this.copy = 'COPIED';
    setTimeout(() => {
      this.copy = 'COPY';
    }, 1000);
  }
}
