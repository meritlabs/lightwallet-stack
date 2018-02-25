import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { BwcService } from '@merit/mobile/app/core/bwc.service';
import { Logger } from '@merit/mobile/app/core/logger';
import { PersistenceService } from '@merit/mobile/app/core/persistence.service';
import { EasyReceipt } from '@merit/mobile/app/easy-receive/easy-receipt.model';
import { ConfigService } from '@merit/mobile/app/shared/config.service';
import { FeeService } from '@merit/mobile/app/shared/fee/fee.service';
import { LedgerService } from '@merit/mobile/app/shared/ledger.service';
import { ENV } from '@app/env';
import { MeritWalletClient } from '../../lib/merit-wallet-client/index';
import { MWCService } from '@merit/common/providers/mwc';

@Injectable()
export class EasyReceiveService {
  constructor(private logger: Logger,
              private persistanceService: PersistenceService,
              private feeService: FeeService,
              private mwcService: MWCService,
              private ledger: LedgerService) {
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
      // We resolve if the easyReceipt is invalid because it does not
      // affect the control flow.
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

  rejectEasyReceipt(wallet, receipt: EasyReceipt, input): Promise<any> {
    const senderAddress = this.mwcService
      .getBitcore()
      .PublicKey.fromString(receipt.senderPublicKey, 'hex')
      .toAddress(wallet.network)
      .toString();


    try {
      return this.spendEasyReceipt(receipt, wallet, input, senderAddress);
    } catch (e) {
      this.persistanceService.deletePendingEasyReceipt(receipt);
      throw e;
    }
  }

  async validateEasyReceiptOnBlockchain(receipt: EasyReceipt, password = '', network = ENV.network): Promise<any> {
    const walletClient = this.mwcService.getClient(null, {});

    try {
      const scriptData = this.generateEasyScipt(receipt, password, network);
      const scriptAddress = this.mwcService.getBitcore().Address(scriptData.scriptPubKey.getAddressInfo()).toString();

      const txs = await walletClient.validateEasyScript(scriptAddress);

      if (!txs.result.length) {
        this.logger.warn('Could not validate easyScript on the blockchain.');
        return false;
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

  deletePendingReceipt(receipt: EasyReceipt) {
    return this.persistanceService.deletePendingEasyReceipt(receipt);
  }

  private async spendEasyReceipt(receipt: EasyReceipt, wallet: MeritWalletClient, input: any, destinationAddress: any): Promise<void> {
    let opts: any = {};

    const invite = _.find(input.txs, (tx: any) => tx.invite);
    await this.sendEasyReceiveTx(input, invite, destinationAddress, wallet);

    const transact = _.find(input.txs, (tx: any) => !tx.invite);
    await this.sendEasyReceiveTx(input, transact, destinationAddress, wallet);

    return this.persistanceService.deletePendingEasyReceipt(receipt);
  }

  private async sendEasyReceiveTx(input: any, tx: any, destinationAddress: string, wallet: MeritWalletClient) {
    let opts: any = {};
    let testTx = await wallet.buildEasySendRedeemTransaction(input, tx, destinationAddress, opts);

    const txOpts = !tx.invite ? {} : { disableSmallFees: true };
    const rawTxLength = testTx.serialize(txOpts).length;

    if (!tx.invite) {
      const feePerKB = await this.feeService.getCurrentFeeRate(wallet.network);
      //TODO: Don't use magic numbers
      opts.fee = Math.round(feePerKB * rawTxLength / 2000);
    }

    const finalTx = await wallet.buildEasySendRedeemTransaction(input, tx, destinationAddress, opts);
    return await wallet.broadcastRawTx({ rawTx: finalTx.serialize(txOpts), network: wallet.network });
  }

  private generateEasyScipt(receipt: EasyReceipt, password, network) {
    const secret = this.ledger.hexToString(receipt.secret);
    const receivePrv = this.mwcService.getBitcore().PrivateKey.forEasySend(secret, password, network);
    const receivePub = this.mwcService.getBitcore().PublicKey.fromPrivateKey(receivePrv).toBuffer();
    const senderPubKey = this.ledger.hexToArray(receipt.senderPublicKey);
    const publicKeys = [receivePub, senderPubKey];
    const script = this.mwcService.getBitcore().Script.buildEasySendOut(publicKeys, receipt.blockTimeout, network);

    return {
      privateKey: receivePrv,
      publicKey: receivePub,
      script: script,
      scriptPubKey: script.toMixedScriptHashOut(senderPubKey),
    };
  }
}
