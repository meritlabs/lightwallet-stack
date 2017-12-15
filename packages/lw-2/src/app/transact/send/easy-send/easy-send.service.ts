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

  public sendSMS(phoneNumber: string, amountMrt:string, url: string): Promise<any> {
    let msg: string = `Here is ${amountMrt} Merit.  Click here to redeem: ${url}`
    if (msg.length > 160) {
      // TODO: Find a way to properly split the URL across two Messages, if needed.
      const msg1: string = `I just sent you ${amountMrt}.  Merit is a new Digital Currency.  `
      const msg2: string = url;

      // HACK: 
      msg = msg2;
    }
    return Promise.resolve(this.socialSharing.shareViaSMS(msg, phoneNumber)).catch((err) => {
      return Promise.reject(new Error('error sending sms: ' + err));
    });
  }

  public sendEmail(emailAddress: string, amountMrt:string, url: string): Promise<any> {
    return Promise.resolve(this.socialSharing.canShareViaEmail()).then(() => {
      const message:string = `I just sent you ${amountMrt} Merit!  Merit is a new digital currency, and if you don't have a Merit Wallet yet, you can easily make one to claim the money. \n Here is the link: \n \n ${url}`
      return this.socialSharing.shareViaEmail(message, `I sent you ${amountMrt}`, [emailAddress]);
    }).catch((err) => {
      return Promise.reject(new Error('error sending email: ' + err));
    })
  }
}