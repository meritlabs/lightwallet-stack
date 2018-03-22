import { Injectable } from '@angular/core';
import { MWCService } from '@merit/common/services/mwc.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { FeeService } from '@merit/common/services/fee.service';
import { EasyReceipt } from '@merit/common/models/easy-receipt';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { ENV } from '@app/env';
import { LedgerService } from '@merit/common/services/ledger.service';
import { PublicKey, PrivateKey, Script, Address, Transaction, crypto} from 'bitcore-lib';
import { RateService } from '@merit/common/services/rate.service';

@Injectable()
export class EasyReceiveService {
  constructor(
    private logger: LoggerService,
    private persistanceService: PersistenceService,
    private feeService: FeeService,
    private mwcService: MWCService,
    private ledger: LedgerService,
    private rateService: RateService
  ) {
  }

  async validateAndSaveParams(params: any): Promise<EasyReceipt> {
    this.logger.debug(`Parsing easy params ${params}`);

    let receipt = new EasyReceipt({});
    receipt.parentAddress = params.pa;
    receipt.secret = params.se;
    receipt.senderName = params.sn;
    receipt.senderPublicKey = params.sk;
    receipt.blockTimeout = params.bt;
    receipt.deepLinkURL = params['~referring_link'];

    if (receipt.isValid()) {
      await this.persistanceService.addPendingEasyReceipt(receipt);
      return receipt;
    } else {
      this.logger.warn('EasyReceipt parameters are invalid: ', receipt);
      // No error thrown because invalid EasyReceipt should not break the flow
      return null;
    }
  }

  async getPendingReceipts(): Promise<Array<EasyReceipt>> {
    const receipts = (await this.persistanceService.getPendingsEasyReceipts()) || [];
    return receipts.map(receipt => new EasyReceipt(receipt));
  }

  acceptEasyReceipt(receipt: EasyReceipt,
                    wallet: MeritWalletClient,
                    input: any,
                    destinationAddress: any): Promise<void> {
    return this.spendEasyReceipt(receipt, wallet, input, destinationAddress);
  }

  async rejectEasyReceipt(wallet, receipt: EasyReceipt, input): Promise<any> {
    try {
      const senderAddress = PublicKey.fromString(receipt.senderPublicKey, 'hex')
        .toAddress(ENV.network)
        .toString();

      await this.spendEasyReceipt(receipt, wallet, input, senderAddress);
    } catch (e) {
      await this.persistanceService.deletePendingEasyReceipt(receipt);
      throw e;
    }
  }

  deletePendingReceipt(receipt: EasyReceipt) {
    return this.persistanceService.deletePendingEasyReceipt(receipt);
  }

  async validateEasyReceiptOnBlockchain(receipt: EasyReceipt, password = '', network = ENV.network): Promise<any> {
    const walletClient = this.mwcService.getClient(null, {});

    try {
      const scriptData = this.generateEasyScipt(receipt, password, network);
      const scriptAddress = Address(scriptData.scriptPubKey.getAddressInfo()).toString();

      const txs = await walletClient.validateEasyScript(scriptAddress);

      if (!txs.result.length) {
        this.logger.warn('Could not validate easyScript on the blockchain.');
        return false
      } else {
        return {
          senderPublicKey: receipt.senderPublicKey,
          txs: txs.result,
          privateKey: scriptData.privateKey,
          publicKey: scriptData.publicKey,
          script: scriptData.script,
          scriptId: scriptAddress,
        };
      }
    } catch (err) {
      this.logger.warn('Could not validate easyScript on the blockchain.', err);
      throw err;
    }
  }

  private async spendEasyReceipt(receipt: EasyReceipt, wallet: MeritWalletClient, input: any, destinationAddress: any): Promise<void> {
    let opts: any = {};

    const invite = input.txs.find(tx => tx.invite);
    await this.sendEasyReceiveTx(input, invite, destinationAddress, wallet);

    const transact = input.txs.find(tx => !tx.invite);
    await this.sendEasyReceiveTx(input, transact, destinationAddress, wallet);

    return this.persistanceService.deletePendingEasyReceipt(receipt);
  }

  private async sendEasyReceiveTx(input: any, tx: any, destinationAddress: string, wallet: MeritWalletClient) {
    if (!tx.invite) tx.amount = this.rateService.mrtToMicro(tx.amount);
    const fee = tx.invite ? 0 : await this.feeService.getEasyReceiveFee();
    const txp = await this.buildEasySendRedeemTransaction(input, tx, destinationAddress, fee);
    return wallet.broadcastRawTx({ rawTx: txp.serialize({disableSmallFees: tx.invite}), network: ENV.network });
  }

  generateEasyScipt(receipt: EasyReceipt, password, network) {
    const secret = this.ledger.hexToString(receipt.secret);
    const receivePrv = PrivateKey.forEasySend(secret, password, network);
    const receivePub = PublicKey.fromPrivateKey(receivePrv).toBuffer();
    const senderPubKey = this.ledger.hexToArray(receipt.senderPublicKey);
    const publicKeys = [receivePub, senderPubKey];
    const script = Script.buildEasySendOut(publicKeys, receipt.blockTimeout, network);

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

    //TODO: Create and sign a transaction to redeem easy send. Use input as
    //unspent Txo and use script to create scriptSig
    let inputAddress = input.scriptId;

    const totalAmount = txn.invite ? txn.amount : txn.amount;
    const amount =  txn.invite ? txn.amount : totalAmount - fee;

    if (amount <= 0) throw new Error('Insufficient funds');

    let tx = new Transaction();

    if (txn.invite) {
      tx.version = Transaction.INVITE_VERSION;
    }

    console.log(input.script.inspect());
    let p2shScript = input.script.toMixedScriptHashOut(input.senderPublicKey);
    const p2shInput = {
      output: Transaction.Output.fromObject({script: p2shScript, micros: totalAmount}),
      prevTxId: txn.txid,
      outputIndex: txn.index,
      script: input.script
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
}
