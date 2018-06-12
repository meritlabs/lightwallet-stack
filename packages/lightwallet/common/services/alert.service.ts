import { Injectable } from '@angular/core';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';

@Injectable()
export class AlertService {
  promptForWalletPassword(walletClient: MeritWalletClient) {}
  confirmAction(title: string, message: string, cb: (value: 'yes' | 'no') => any) {}
}
