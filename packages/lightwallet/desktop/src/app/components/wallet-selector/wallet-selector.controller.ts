import { Injectable } from '@angular/core';
import { DOMController } from '@merit/desktop/app/components/dom.controller';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { WalletSelectorComponent } from '@merit/desktop/app/components/wallet-selector/wallet-selector.component';

@Injectable()
export class WalletSelectorController {
  constructor(private domCtrl: DOMController) {}

  create(wallets: DisplayWallet[], text: string = 'Select a wallet to continue'): WalletSelectorComponent {
    return this.domCtrl.create(WalletSelectorComponent, { wallets: wallets, text });
  }
}
