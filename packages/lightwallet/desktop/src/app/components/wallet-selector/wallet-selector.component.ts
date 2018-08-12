import { Component, ViewEncapsulation } from '@angular/core';
import { IDynamicComponent } from '@merit/desktop/app/components/dom.controller';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { safeCall } from '@merit/common/utils';

export interface IWalletSelectorConfig {
  wallets: DisplayWallet[];
  text: string;
}

@Component({
  selector: 'wallet-selector',
  templateUrl: './wallet-selector.component.html',
  styleUrls: ['./wallet-selector.component.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class WalletSelectorComponent implements IDynamicComponent {
  config: IWalletSelectorConfig;

  destroy: Function;
  _onDismiss;

  ready: boolean;

  init(config: IWalletSelectorConfig) {
    this.config = config;
    this.ready = true;
  }

  dismiss(wallet?: DisplayWallet) {
    safeCall(this._onDismiss, [wallet], new Error('No onDidDismiss handler was passed'));
    safeCall(this.destroy, null, new Error('No destroy handler was passed'));
  }

  onDidDismiss(callback: (wallet: DisplayWallet) => any) {
    this._onDismiss = callback;
  }

  onBackdropClick() {
    this.dismiss();
  }
}
