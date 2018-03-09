import { Injectable, Optional } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import { MWCService } from '@merit/common/services/mwc.service';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { EasySend } from '@merit/common/models/easy-send';
import { ENV } from '@app/env';
import * as Bitcore from 'bitcore-lib';

@Injectable()
export class EasySendService {
  private bitcore: any = this.mwcService.getBitcore();

  private readonly DEFAULT_TIMEOUT = 1008;

  constructor(private persistenceService: PersistenceService,
              @Optional() private socialSharing: SocialSharing,
              private mwcService: MWCService) {}

  async createEasySendScriptHash(wallet: MeritWalletClient, password:string = ''): Promise<EasySend> {
    const rootKey = this.bitcore.HDPrivateKey.fromString(wallet.credentials.xPrivKey);
    const signPrivKey = rootKey.privateKey;
    const pubkey = signPrivKey.publicKey;

    try {
      const easySend = await this.bulidScript(wallet, password);
      const easySendAddress = this.bitcore.Address(easySend.script.getAddressInfo()).toString();

      const scriptReferralOpts = {
        parentAddress: wallet.getRootAddress().toString(),
        pubkey: pubkey.toString(), // sign pubkey used to verify signature
        signPrivKey,
        address: easySendAddress,
        addressType: this.bitcore.Address.PayToScriptHashType, // script address
        network: ENV.network,
      };

      // easy send address is a mix of script_id pubkey_id
      easySend.parentAddress = wallet.getRootAddress().toString();
      easySend.scriptAddress = easySendAddress;
      easySend.scriptReferralOpts = scriptReferralOpts;

      return easySend;
    } catch (err) {
      throw new Error('error building easysend script' + err);
    }
  }

  async sendSMS(phoneNumber: string, amountMrt: string, url: string): Promise<any> {
    let msg: string = `Here is ${amountMrt} Merit.  Click here to redeem: ${url}`
    if (msg.length > 160) {
      // TODO: Find a way to properly split the URL across two Messages, if needed.
      const msg1: string = `I just sent you ${amountMrt} Merit.  Merit is a new Digital Currency.  `;
      const msg2: string = url;

      // HACK:
      msg = msg2;

    }

    try  {
      return this.socialSharing.shareViaSMS(msg, phoneNumber)
    } catch (err) {
      throw new Error('Error sending sms: ' + err);
    }
  }

  async sendEmail(emailAddress: string, amountMrt: string, url: string): Promise<any> {
    try {
      if (await this.socialSharing.canShareViaEmail()) {
        const message: string =
          `I just sent you ${amountMrt} Merit! ` +
          `Merit is a new digital currency, and if you don't have a Merit Wallet yet, ` +
          `you can easily make one to claim the money. \n \n` +
          `Here is the link to claim the Merit: \n \n ${url}`
        return this.socialSharing.shareViaEmail(message, `Here is ${amountMrt} Merit!`, [emailAddress]);
      }
    } catch (err) {
      throw new Error('error sending email: ' + err);
    }
  }

  async updatePendingEasySends(wallet: MeritWalletClient) {
    let easySends: EasySend[] = await this.persistenceService.getPendingEasySends(wallet.id);
    easySends = easySends || [];

    easySends = await Promise.all(easySends.map(async (easySend: EasySend) => {
      console.log('Easy send is ', easySend);
      if (!easySend.scriptAddress) return null;
      const txs = await wallet.validateEasyScript(easySend.scriptAddress.toString());
      return txs.result.every(tx => !tx.spent) ? easySend : null;
    }));
    easySends = easySends.filter((easySend: EasySend) => easySend !== null);
    await this.persistenceService.setPendingEasySends(wallet.id, easySends);
    return easySends;
  }

  async storeEasySend(walletId: string, easySend: EasySend): Promise<void> {
    const history: EasySend[] = await this.persistenceService.getPendingEasySends(walletId) || [];
    history.push(easySend);
    return this.persistenceService.setPendingEasySends(walletId, history);
  }

  /**
   * Create an easySend script and create a transaction to the script address
   */
  private async bulidScript(wallet, passphrase = '', timeout = this.DEFAULT_TIMEOUT): Promise<EasySend> {

    const address = wallet.getRootAddress(); //todo check
    const pubKey  = Bitcore.PublicKey.fromString(address.publicKeys[0]);
    const rcvPair = Bitcore.PrivateKey.forNewEasySend(passphrase, ENV.network);
    let pubKeys = [
      rcvPair.key.publicKey.toBuffer(),
      pubKey.toBuffer()
    ];
    const script = Bitcore.Script.buildEasySendOut(pubKeys, timeout, ENV.network);

    return {
      receiverPubKey: rcvPair.key.publicKey,
      script: script.toMixedScriptHashOut(pubKey),
      senderName: 'Someone', // TODO: get user name or drop sender name from data
      senderPubKey: pubKey.toString(),
      secret: rcvPair.secret.toString('hex'),
      blockTimeout: timeout,
      parentAddress: '',
      scriptAddress: '',
      scriptReferralOpts: {}
    };
  }
}
