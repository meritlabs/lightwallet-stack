import { Injectable } from '@angular/core';
import { AlertService } from '@merit/common/services/alert.service';
import { AlertController } from 'ionic-angular';
import { MeritWalletClient } from '../../../common/merit-wallet-client';

@Injectable()
export class MobileAlertService extends AlertService {
  constructor(private alertCtrl: AlertController) {
    super();
  }

  promptForWalletPassword(wallet: MeritWalletClient) {
    return new Promise((resolve, reject) => {
      const showPassPrompt = (highlightInvalid = false) => {
        this.alertCtrl
          .create({
            title: 'Enter wallet password',
            cssClass: highlightInvalid ? 'invalid-input-prompt password-prompt' : 'password-prompt',
            inputs: [{ name: 'password', placeholder: 'Password', type: 'text' }],
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  reject();
                },
              },
              {
                text: 'Ok',
                handler: data => {
                  if (!data.password) {
                    showPassPrompt(true);
                  } else {
                    try {
                      wallet.decryptPrivateKey(data.password);
                      wallet.encryptPrivateKey(data.password);
                      resolve(data.password);
                    } catch (e) {
                      showPassPrompt(true);
                    }
                  }
                },
              },
            ],
          })
          .present();
      };

      showPassPrompt();
    });
  }
}
