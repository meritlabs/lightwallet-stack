import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { EasyReceipt } from '@merit/common/models/easy-receipt';
import { FeeService } from '@merit/common/services/fee.service';
import { LedgerService } from '@merit/common/services/ledger.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { MWCService } from '@merit/common/services/mwc.service';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { RateService } from '@merit/common/services/rate.service';
import { accessWallet, WalletService } from '@merit/common/services/wallet.service';
import { Address, crypto, HDPrivateKey, HDPublicKey, PrivateKey, PublicKey, Script, Transaction } from 'meritcore-lib';
import { Subject } from 'rxjs/Subject';
import { AlertService } from '@merit/common/services/alert.service';

@Injectable()
export class EasyReceiveService {
  constructor(
    private logger: LoggerService,
    private persistenceService: PersistenceService,
    private persistenceService2: PersistenceService2,
    private feeService: FeeService,
    private mwcService: MWCService,
    private ledger: LedgerService,
    private rateService: RateService,
    private walletService: WalletService,
    private alertCtrl: AlertService,
  ) {}

  private cancelEasySendSource = new Subject<EasyReceipt>();
  private cancelledEasySendSource = new Subject<EasyReceipt>();
  private easyReceiptsSource = new Subject<EasyReceipt>();

  cancelEasySendObservable$ = this.cancelEasySendSource.asObservable();
  cancelledEasySend$ = this.cancelledEasySendSource.asObservable();
  easyReceipts$ = this.easyReceiptsSource.asObservable();

  parseEasySendUrl(url: string) {
    let offset = Math.max(0, url.indexOf('?') + 1);
    const data: any = {};
    url
      .substr(offset)
      .split('&')
      .forEach((q: any) => {
        q = q.split('=');
        data[q[0]] = q[1];
      });
    return data;
  }

  paramsToReceipt(params: any): EasyReceipt {
    return new EasyReceipt({
      parentAddress: params.pa,
      secret: params.se,
      senderName: params.sn,
      senderPublicKey: params.sk,
      blockTimeout: params.bt,
      deepLinkURL: params['~referring_link'],
    });
  }

  async validateAndSaveParams(params: any): Promise<EasyReceipt> {
    this.logger.debug(`Parsing easy params ${params}`);

    let receipt = this.paramsToReceipt(params);

    if (receipt.isValid()) {
      await this.persistenceService.addPendingEasyReceipt(receipt);
      this.easyReceiptsSource.next();
      return receipt;
    } else {
      this.logger.warn('EasyReceipt parameters are invalid: ', receipt);
      // No error thrown because invalid EasyReceipt should not break the flow
      return null;
    }
  }

  async getPendingReceipts(): Promise<Array<EasyReceipt>> {
    const receipts = (await this.persistenceService.getPendingsEasyReceipts()) || [];
    return receipts.map(receipt => new EasyReceipt(receipt));
  }

  @accessWallet
  acceptEasyReceipt(
    wallet: MeritWalletClient,
    receipt: EasyReceipt,
    input: any,
    destinationAddress: any,
  ): Promise<void> {
    return this.spendEasyReceipt(receipt, wallet, input, destinationAddress);
  }

  async rejectEasyReceipt(wallet, receipt: EasyReceipt, input): Promise<any> {
    try {
      const senderAddress = PublicKey.fromString(receipt.senderPublicKey, 'hex')
        .toAddress(ENV.network)
        .toString();

      await this.spendEasyReceipt(receipt, wallet, input, senderAddress);
    } catch (e) {
      await this.persistenceService.deletePendingEasyReceipt(receipt);
      throw e;
    }
  }

  deletePendingReceipt(receipt: EasyReceipt) {
    return this.persistenceService.deletePendingEasyReceipt(receipt);
  }

  /**
   * Define amount that is shown to recipient (initial amount minus fee)
   */
  async getReceiverAmount(txs: Array<any>): Promise<number> {
    const tx = txs.find(tx => !tx.invite);
    const amount = tx ? tx.amount : 0;
    return amount - this.rateService.microsToMrt(await this.feeService.getEasyReceiveFee());
  }

  async getInvitesAmount(txs: Array<any>) {
    const tx = txs.find(tx => tx.invite);
    return tx ? tx.amount : 0;
  }

  isInviteOnly(txs: Array<any>) {
    return !txs.some(tx => !tx.invite);
  }

  async validateEasyReceiptOnBlockchain(receipt: EasyReceipt, password = ''): Promise<any> {
    const walletClient = this.mwcService.getClient(null, {});

    try {
      const scriptData = this.generateEasyScipt(receipt, password);
      const scriptAddress = Address(scriptData.scriptPubKey.getAddressInfo()).toString();

      const txs = await walletClient.validateEasyScript(scriptAddress);

      return {
        senderPublicKey: receipt.senderPublicKey,
        txs: txs.result,
        privateKey: scriptData.privateKey,
        publicKey: scriptData.publicKey,
        script: scriptData.script,
        scriptId: scriptAddress,
      };
    } catch (err) {
      this.logger.error('Could not validate easyScript on the blockchain.', err);
      throw err;
    }
  }

  private async spendEasyReceipt(
    receipt: EasyReceipt,
    wallet: MeritWalletClient,
    input: any,
    destinationAddress: any,
  ): Promise<void> {
    // Claim invites
    await Promise.all(input.txs.map(tx => tx.invite && this.sendEasyReceiveTx(input, tx, destinationAddress, wallet)));

    // Claim txs
    await Promise.all(input.txs.map(tx => !tx.invite && this.sendEasyReceiveTx(input, tx, destinationAddress, wallet)));

    return this.persistenceService.deletePendingEasyReceipt(receipt);
  }

  private async sendEasyReceiveTx(input: any, tx: any, destinationAddress: string, wallet: MeritWalletClient) {
    if (!tx.invite) tx.amount = this.rateService.mrtToMicro(tx.amount);
    const fee = tx.invite ? 0 : await this.feeService.getEasyReceiveFee();
    const txp = await this.buildEasySendRedeemTransaction(input, tx, destinationAddress, fee);
    return this.walletService.broadcastRawTx(wallet, {
      rawTx: txp.serialize({ disableSmallFees: tx.invite }),
      network: ENV.network,
    });
  }

  generateEasyScipt(receipt: EasyReceipt, password: string) {
    const secret = this.ledger.hexToString(receipt.secret);
    const receivePrv = PrivateKey.forEasySend(secret, password, ENV.network);
    const receivePub = PublicKey.fromPrivateKey(receivePrv).toBuffer();
    const senderPubKey = this.ledger.hexToArray(receipt.senderPublicKey);
    const publicKeys = [receivePub, senderPubKey];
    const script = Script.buildEasySendOut(publicKeys, receipt.blockTimeout, ENV.network);

    return {
      privateKey: receivePrv,
      publicKey: receivePub,
      script: script,
      scriptPubKey: script.toMixedScriptHashOut(senderPubKey),
    };
  }

  /**
   * Creates a transaction to redeem an easy send transaction. The input param
   * must contain
   *    {
   *      txs: [<transaction info from getinputforeasysend cli call>],
   *      privateKey: <private key used to sign script>,
   *      publicKey: <pub key of the private key>,
   *      script: <easysend script to redeem>,
   *      scriptId: <Address used script>
   *    }
   *
   * input.txs contains
   *     {
   *      amount: <amount in MRT to redeem>,
   *      index: <index of unspent transaction>,
   *      txid: <id of transaction associated with the scriptId>
   *     }
   * @param {input} Input described above.
   * @param {toAddress} Address to put the funds into.
   */
  buildEasySendRedeemTransaction(input: any, txn: any, toAddress: string, fee = FeeService.DEFAULT_FEE): Promise<any> {
    const totalAmount = txn.amount;
    const amount = txn.invite ? txn.amount : totalAmount - fee;

    if (amount <= 0) throw new Error('Insufficient funds');

    let tx = new Transaction();

    if (txn.invite) {
      tx.version = Transaction.INVITE_VERSION;
    }

    let p2shScript = input.script.toMixedScriptHashOut(input.senderPublicKey);
    const p2shInput = {
      output: Transaction.Output.fromObject({ script: p2shScript, micros: totalAmount }),
      prevTxId: txn.txid,
      outputIndex: txn.index,
      script: input.script,
    };
    tx.addInput(new Transaction.Input.PayToScriptHashInput(p2shInput, input.script, p2shScript));

    tx.to(toAddress, amount);

    if (!txn.invite) {
      tx.fee(fee);
    }

    const sig = Transaction.Sighash.sign(tx, input.privateKey, crypto.Signature.SIGHASH_ALL, 0, input.script);
    const pubKeyId = PublicKey.fromString(input.senderPublicKey)._getID();
    let inputScript = Script.buildEasySendIn(sig, input.script, pubKeyId);
    tx.inputs[0].setScript(inputScript);

    return tx;
  }

  cancelEasySend(url: string) {
    let params = this.parseEasySendUrl(url);
    let receipt = this.paramsToReceipt(params);

    this.cancelEasySendSource.next(receipt);
  }

  getScriptAddress(scriptData: any) {
    return Address(scriptData.scriptPubKey.getAddressInfo()).toString();
  }

  @accessWallet
  async cancelEasySendReceipt(
    wallet: MeritWalletClient,
    receipt: EasyReceipt,
    password: string,
    walletPassword: string,
  ) {
    //figure out wallet info
    const signingKey = wallet.getRootPrivateKey(walletPassword);
    const pubKey = wallet.getRootAddressPubkey();
    const destAddress = pubKey.toAddress(ENV.network);

    //generate script based on receipt
    const scriptData = this.generateEasyScipt(receipt, password);
    const redeemScript = scriptData.script;
    const scriptAddress = this.getScriptAddress(scriptData);

    //find the invite and transaction
    const txsRes = await wallet.validateEasyScript(scriptAddress.toString());
    const txs = txsRes.result;

    //construct input using wallet signing key as the private key
    const input = {
      script: redeemScript,
      privateKey: signingKey,
      senderPublicKey: pubKey.toString(),
    };

    //get the invite back
    const invite = txs.find(tx => tx.invite);
    if (invite) await this.sendEasyReceiveTx(input, invite, destAddress, wallet);

    //get the merit back
    const transact = txs.find(tx => !tx.invite);
    if (transact) await this.sendEasyReceiveTx(input, transact, destAddress, wallet);

    await wallet.cancelGlobalSend(scriptAddress.toString());

    this.cancelledEasySendSource.next(scriptAddress.toString());

    return {
      invite: invite,
      tx: transact,
    };
  }
}
