import { Injectable } from '@angular/core';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { AlertService } from '@merit/common/services/alert.service';
import { PasswordPromptController } from '@merit/desktop/app/components/password-prompt/password-prompt.controller';

@Injectable()
export class DesktopAlertService extends AlertService {
  constructor(private passwordPromptCtrl: PasswordPromptController) {
    super();
  }

  promptForWalletPassword(wallet: MeritWalletClient) {
    return new Promise<string>((resolve, reject) => {
      this.passwordPromptCtrl.createForWallet(wallet).onDidDismiss((password: string) => {
        if (password) resolve(password);
        else reject();
      });
    });
  }
}
