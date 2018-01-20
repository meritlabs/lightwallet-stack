import { Injectable } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import { BwcService } from 'merit/core/bwc.service';
import { PersistenceService } from 'merit/core/persistence.service';
import { EasySend } from 'merit/transact/send/easy-send/easy-send.model';
import { MeritWalletClient } from 'src/lib/merit-wallet-client';

@Injectable()
export class EasySendService {
  private bitcore: any;

  constructor(private persistenceService: PersistenceService,
              private socialSharing: SocialSharing,
              private bwcService: BwcService) {
    this.bitcore = this.bwcService.getBitcore();
  }

  public createEasySendScriptHash(wallet: MeritWalletClient): Promise<EasySend> {
    const signPrivKey = this.bitcore.PrivateKey(wallet.credentials.walletPrivKey, wallet.network);
    const pubkey = signPrivKey.toPublicKey();

    // TODO: get a passphrase from the user
    let opts = {
      network: wallet.network,
      parentAddress: pubkey.toAddress().toString(),
      passphrase: '',
    };

    return wallet
      .buildEasySendScript(opts)
      .then(easySend => {
        const easySendAddress = this.bitcore.Address(easySend.script.getAddressInfo()).toString();
        const receiverPrivKey = this.bitcore.PrivateKey.forEasySend(easySend.secret, opts.passphrase, opts.network);

        const scriptReferralOpts = {
          parentAddress: signPrivKey.publicKey.toAddress().toString(),
          pubkey: pubkey.toString(), // sign pubkey used to verify signature
          signPrivKey,
          address: easySendAddress,
          addressType: 2, // script address
          network: opts.network,
        };

        const recipientReferralOpts = {
          parentAddress: pubkey.toAddress().toString(),
          pubkey: receiverPrivKey.publicKey.toString(),
          signPrivKey: receiverPrivKey,
          address: easySend.receiverPubKey.toAddress().toString(),
          addressType: 1, // pubkeyhash address
          network: opts.network,
        };

        // easy send address is a mix of script_id pubkey_id
        easySend.scriptAddress = easySendAddress;
        easySend.scriptReferralOpts = scriptReferralOpts;
        easySend.recipientReferralOpts = recipientReferralOpts;

        return easySend;
      })
      .catch(err => {
        return Promise.reject(new Error('error building easysend script' + err));
      });
  }

  public sendSMS(phoneNumber: string, amountMrt: string, url: string): Promise<any> {
    let msg: string = `Here is ${amountMrt} Merit.  Click here to redeem: ${url}`
    if (msg.length > 160) {
      // TODO: Find a way to properly split the URL across two Messages, if needed.
      const msg1: string = `I just sent you ${amountMrt} Merit.  Merit is a new Digital Currency.  `;
      const msg2: string = url;

      // HACK:
      msg = msg2;
    }
    return Promise.resolve(this.socialSharing.shareViaSMS(msg, phoneNumber)).catch((err) => {
      return Promise.reject(new Error('error sending sms: ' + err));
    });
  }

  public sendEmail(emailAddress: string, amountMrt: string, url: string): Promise<any> {
    return Promise.resolve(this.socialSharing.canShareViaEmail()).then(() => {
      const message: string =
        `I just sent you ${amountMrt} Merit! ` +
        `Merit is a new digital currency, and if you don't have a Merit Wallet yet, ` +
        `you can easily make one to claim the money. \n \n` +
        `Here is the link to claim the Merit: \n \n ${url}`
      return this.socialSharing.shareViaEmail(message, `Here is ${amountMrt} Merit!`, [emailAddress]);
    }).catch((err) => {
      return Promise.reject(new Error('error sending email: ' + err));
    })
  }

  public cancelPendingEasySend(wallet: MeritWalletClient, easySend: EasySend, address) {

  }

  async updatePendingEasySends(wallet: MeritWalletClient) {
    let easySends: EasySend[] = await this.persistenceService.getPendingEasySends(wallet.id);
    easySends = easySends || [];

    easySends = await Promise.all(easySends.map(async (easySend: EasySend) => {
      const txn = await wallet.validateEasyScript(easySend.scriptAddress.toString());
      return txn.result.found && !txn.result.spent ? easySend : null;
    }));
    easySends = easySends.filter((easySend: EasySend) => easySend !== null);
    await this.persistenceService.setPendingEasySends(wallet.id, easySends);
    return easySends;
  }

  public storeEasySend(walletId: string, easySend: EasySend): Promise<void> {
    return this.persistenceService.getPendingEasySends(walletId)
      .then((history: EasySend[]) => {
        history = history || [];
        history.push(easySend);
        return history;
      })
      .then((newHistory: EasySend[]) => {
        return this.persistenceService.setPendingEasySends(walletId, newHistory);
      });
  }
}
