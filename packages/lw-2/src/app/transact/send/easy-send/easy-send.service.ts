import * as Promise from 'bluebird';
import { Injectable } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import { MeritWalletClient } from 'src/lib/merit-wallet-client';
import { EasySend } from 'merit/transact/send/easy-send/easy-send.model';

@Injectable()
export class EasySendService {
  constructor(
    private socialSharing: SocialSharing
  ) {}
  public createEasySendScriptHash(wallet: MeritWalletClient): Promise<EasySend> {

    // TODO: get a passphrase from the user
    let opts = {
      network: wallet.network,
      unlockCode: wallet.shareCode,
      passphrase: ''
    };

    return wallet.buildEasySendScript(opts).then((easySend) => {
      let unlockScriptOpts = {
        unlockCode: wallet.shareCode,
        address: easySend.script.toAddress().toString(), // not typechecked yet
        network: opts.network
      };
      return wallet.unlockAddress(unlockScriptOpts).then(() => {
        let unlockRecipientOpts = {
          unlockCode: wallet.shareCode,
          address: easySend.receiverPubKey.toAddress().toString(), // not typechecked yet
          network: opts.network
        };
        return wallet.unlockAddress(unlockRecipientOpts);
      }).then(() => {
        return Promise.resolve(easySend);
      });
    }).catch((err) => {
      return Promise.reject(new Error('error building easysend script' + err));
    });
  }

  public sendSMS(phoneNumber: string, url: string): Promise<any> {
    return Promise.resolve(this.socialSharing.shareViaSMS(url, phoneNumber)).catch((err) => {
      return Promise.reject(new Error('error sending sms: ' + err));
    });
  }

  public sendEmail(emailAddress: string, url: string): Promise<any> {
    return Promise.resolve(this.socialSharing.canShareViaEmail()).then(() => {
      return this.socialSharing.shareViaEmail(url, 'Someone sent you some Merit', [emailAddress]);
    }).catch((err) => {
      return Promise.reject(new Error('error sending email: ' + err));
    })
  }
}