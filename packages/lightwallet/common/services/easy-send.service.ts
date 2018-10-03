import { Injectable, Optional } from '@angular/core';
import { ENV } from '@app/env';
import { SocialSharing } from '@ionic-native/social-sharing';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { EasySend } from '@merit/common/models/easy-send';
import { AddressService } from '@merit/common/services/address.service';
import { FeeService } from '@merit/common/services/fee.service';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { accessWallet } from '@merit/common/services/wallet.service';
import { Address, HDPrivateKey, PrivateKey, Script } from 'meritcore-lib';
import { AlertService } from '@merit/common/services/alert.service';

@Injectable()
export class EasySendService {

  private readonly DEFAULT_TIMEOUT = 10080; // 7 days * 24 hours * 60 minutes

  constructor(
    private feeService: FeeService,
    private persistenceService: PersistenceService,
    @Optional() private socialSharing: SocialSharing,
    private addressService: AddressService,
    private alertCtrl: AlertService) {}

  @accessWallet
  async createEasySendScriptHash(wallet: MeritWalletClient, password?: string): Promise<EasySend> {
    const rootKey = HDPrivateKey.fromString(wallet.credentials.xPrivKey);
    const signPrivKey = rootKey.privateKey;
    const pubkey = signPrivKey.publicKey;

    const easySend = await this.bulidScript(wallet, password);
    const easySendAddress = Address(easySend.script.getAddressInfo()).toString();

    const scriptReferralOpts = {
      parentAddress: wallet.getRootAddress().toString(),
      pubkey: pubkey.toString(), // sign pubkey used to verify signature
      signPrivKey,
      address: easySendAddress,
      addressType: Address.PayToScriptHashType, // script address
      network: ENV.network
    };

    // easy send address is a mix of script_id pubkey_id
    easySend.parentAddress = wallet.getRootAddress().toString();
    easySend.scriptAddress = easySendAddress;
    easySend.scriptReferralOpts = scriptReferralOpts;

    easySend.script.isOutput = true;
    return easySend;
  }

  async sendSMS(phoneNumber: string, amountMrt: string, url: string): Promise<any> {
    let msg: string = `Here is ${amountMrt} Merit.  Click here to redeem: ${url}`;
    if (msg.length > 160) {
      // TODO: Find a way to properly split the URL across two Messages, if needed.
      const msg1: string = `I just sent you ${amountMrt} Merit.  Merit is a new Digital Currency.  `;
      const msg2: string = url;

      // HACK:
      msg = msg2;

    }

    try {
      return this.socialSharing.shareViaSMS(msg, phoneNumber);
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
          `Here is the link to claim the Merit: \n \n ${url}`;
        return this.socialSharing.shareViaEmail(message, `Here is ${amountMrt} Merit!`, [emailAddress]);
      }
    } catch (err) {
      throw new Error('error sending email: ' + err);
    }
  }

  async updatePendingEasySends(wallet: MeritWalletClient) {
    let easySends: EasySend[] = (await this.persistenceService.getPendingEasySends(wallet.id)) || [];

    easySends = await Promise.all(easySends.map(async (easySend: EasySend) => {
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

  prepareTxp(wallet: MeritWalletClient, amount: number, easySend: EasySend) {
    if (amount > Number.MAX_SAFE_INTEGER) throw new Error('The amount is too big');

    const txp: any = {
      outputs: [{
        'script': easySend.script.toHex(),
        'toAddress': easySend.scriptAddress,
        'amount': amount
      }],
      inputs: [], // will be defined on MWS side
      feeLevel: this.feeService.getCurrentFeeLevel(),
      excludeUnconfirmedUtxos: false,
      dryRun: true,
      addressType: 'P2SH'
    };

    if (amount == wallet.balance.spendableAmount) {
      delete txp.outputs[0].amount;
      txp.sendMax = true;
    }

    return wallet.createTxProposal(txp);

  }

  /**
   * Create an easySend script
   */
  async bulidScript(wallet, passphrase?: string, timeout = this.DEFAULT_TIMEOUT): Promise<EasySend> {
    passphrase = passphrase || '';
    const pubKey = wallet.getRootAddressPubkey();
    const rcvPair = PrivateKey.forNewEasySend(passphrase, ENV.network);
    const pubKeys = [
      rcvPair.key.publicKey.toBuffer(),
      pubKey.toBuffer()
    ];
    const script = Script.buildEasySendOut(pubKeys, timeout, ENV.network);

    const addressInfo = await this.addressService.getAddressInfo(wallet.getRootAddress().toString());

    return {
      receiverPubKey: rcvPair.key.publicKey,
      script: script.toMixedScriptHashOut(pubKey),
      senderName: addressInfo.alias ? addressInfo.alias : 'Someone',
      senderPubKey: pubKey.toString(),
      secret: rcvPair.secret.toString('hex'),
      blockTimeout: timeout,
      parentAddress: '',
      scriptAddress: '',
      scriptReferralOpts: {},
      cancelled: false,
      inviteOnly: false
    };
  }

}
