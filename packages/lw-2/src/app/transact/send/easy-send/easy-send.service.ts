import * as Promise from 'bluebird';
import { Injectable } from '@angular/core';
import { BwcService } from 'merit/core/bwc.service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { MeritWalletClient } from 'src/lib/merit-wallet-client';
import { EasySend } from 'merit/transact/send/easy-send/easy-send.model';

@Injectable()
export class EasySendService {
  private bitcore: any;

  constructor(
    private socialSharing: SocialSharing,
    private bwcService: BwcService
  ) {
    this.bitcore = this.bwcService.getBitcore();
  }

  public createEasySendScriptHash(wallet: MeritWalletClient): Promise<EasySend> {
    const signPrivKey = this.bitcore.PrivateKey(wallet.credentials.walletPrivKey, wallet.network);
    const pubkey = signPrivKey.toPublicKey();

    // TODO: get a passphrase from the user
    let opts = {
      network: wallet.network,
      parentAddress: pubkey.toAddress().toString(),
      passphrase: ''
    };


    return wallet.buildEasySendScript(opts).then(easySend => {
      console.log('EASYSEND SCRIPT BUILT');
      const easySendAddress = this.bitcore.Hash.ripemd160(
        easySend.script.toBuffer().concat([pubkey._getID().toBuffer()]),
      );

      let unlockScriptOpts = {
        parentAddress: signPrivKey.publicKey.toAddress(),
        pubkey: pubkey.toString(), // sign pubkey used to verify signature
        signPrivKey,
        address: this.bitcore.Address.fromPublicKeyHash(easySendAddress).toString(), // not typechecked yet
        addressType: 2, // script address
        network: opts.network
      };
      return wallet.signAddressAndUnlock(unlockScriptOpts).then(() => {
        const privKey = this.bitcore.PrivateKey.forEasySend(easySend.secret, opts.passphrase, opts.network);

        let unlockRecipientOpts = {
          parentAddress: pubkey.toAddress().toString(),  // short-circuit
          pubkey: privKey.publicKey.toString(),// sign pubkey used to verify signature
          signPrivKey: privKey,
          address: easySend.receiverPubKey.toAddress().toString(), // not typechecked yet
          addressType: 1, // script address
          network: opts.network
        };
        return wallet.signAddressAndUnlock(unlockRecipientOpts);
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
      const msg1: string = `I just sent you ${amountMrt} Merit.  Merit is a new Digital Currency.  `
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
      const message:string = `I just sent you ${amountMrt} Merit!  Merit is a new digital currency, and if you don't have a Merit Wallet yet, you can easily make one to claim the money. \n \n Here is the link to claim the Merit: \n \n ${url}`
      return this.socialSharing.shareViaEmail(message, `Here is ${amountMrt} Merit!`, [emailAddress]);
    }).catch((err) => {
      return Promise.reject(new Error('error sending email: ' + err));
    })
  }
}
