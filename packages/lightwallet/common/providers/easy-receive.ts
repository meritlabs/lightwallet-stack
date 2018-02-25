import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { MWCService } from '@merit/common/providers/mwc';
import { LoggerService } from '@merit/common/providers/logger';
import { PersistenceService } from '@merit/common/providers/persistence';
import { FeeService } from '@merit/common/providers/fee';
import { EasyReceipt } from '@merit/common/models/easy-receipt';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';

@Injectable()
export class EasyReceiveService {
  constructor(private logger: LoggerService,
              private persistanceService: PersistenceService,
              private feeService: FeeService,
              private mwcService: MWCService) {
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
}
