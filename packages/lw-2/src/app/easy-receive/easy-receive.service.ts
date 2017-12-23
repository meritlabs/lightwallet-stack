import { Injectable } from '@angular/core';
import { EasyReceipt } from "merit/easy-receive/easy-receipt.model";
import { Logger } from 'merit/core/logger';
import { PersistenceService } from 'merit/core/persistence.service';
import { FeeService } from 'merit/shared/fee/fee.service'
import { BwcService } from 'merit/core/bwc.service';
import { ConfigService } from 'merit/shared/config.service';
import { LedgerService } from 'merit/shared/ledger.service';
import * as Promise from 'bluebird';
import { MeritWalletClient } from 'src/lib/merit-wallet-client';

@Injectable()
export class EasyReceiveService { 

  constructor(
    private logger:Logger,
    private persistanceService:PersistenceService,
    private feeService:FeeService,
    private bwcService:BwcService,
    private configService:ConfigService,
    private ledger:LedgerService
  ) {}
  
  public validateAndSaveParams(params:any):Promise<EasyReceipt> {
    return new Promise((resolve, reject) => {

      this.logger.debug(`Parsing easy params ${params}`);
  
      let receipt = new EasyReceipt({});
      receipt.unlockCode = params.uc;
      receipt.secret = params.se; 
      receipt.senderName = params.sn;
      receipt.senderPublicKey = params.sk;
      receipt.blockTimeout = params.bt; 
      receipt.deepLinkURL = params['~referring_link'];

      if (receipt.isValid()) {
        return this.persistanceService.addPendingEasyReceipt(receipt).then(() => {
            return resolve(receipt);
        });
      } else {
        this.logger.warn('EasyReceipt parameters are invalid: ', receipt); 
        // We resolve if the easyReceipt is invalid because it does not 
        // affect the control flow.
        return resolve(null);
      }

    });
  }

  public getPendingReceipts():Promise<Array<EasyReceipt>> {
    return this.persistanceService.getPendingsEasyReceipts()
      .then(receipts => receipts || [])
      .map((receipt) => {
        return new EasyReceipt(receipt);
      });
  }

  public acceptEasyReceipt(receipt:EasyReceipt, wallet:MeritWalletClient, input, destinationAddress:any):Promise<void>  {
      return this.spendEasyReceipt(receipt, wallet, input, destinationAddress);
  }

  
  public rejectEasyReceipt(wallet, receipt:EasyReceipt, input):Promise<any> {
    return Promise.resolve(
      this.bwcService.getBitcore().PublicKey
        .fromString(receipt.senderPublicKey, 'hex')
        .toAddress(wallet.network)
        .toString()
    ).then((senderAddress) => {
      return this.spendEasyReceipt(receipt, wallet, input, senderAddress);
    }).catch((err) => {
      return this.persistanceService.deletePendingEasyReceipt(receipt).then(() => {
        return Promise.reject(err);
      })
    });
  }

  public validateEasyReceiptOnBlockchain(receipt:EasyReceipt, password = '', network = this.configService.getDefaults().network.name) {
    let opts = {
      bwsurl: this.configService.getDefaults().bws.url
    };
    let walletClient = this.bwcService.getClient(null, opts);
    let onBlockChain = false;

    let scriptData = this.generateEasyScipt(receipt, password, network);
    var scriptId = this.bwcService.getBitcore().Address.payingTo(scriptData.script, network);

    return walletClient.validateEasyScript(scriptId).then((txn) => {
      return ({
        txn: txn.result,
        privateKey: scriptData.privateKey,
        publicKey: scriptData.publicKey,
        script: scriptData.script,
        scriptId: scriptId,
      });
    }).catch((err) => {
      this.logger.warn("Could not validate easyScript on the blockchain.", err);
      return Promise.reject(err);
    });
  }

  public deletePendingReceipt(receipt:EasyReceipt) {
    return this.persistanceService.deletePendingEasyReceipt(receipt);
  }

  private spendEasyReceipt(receipt:EasyReceipt, wallet:MeritWalletClient, input, destinationAddress:string):Promise<void> {
    let opts:any = {}; 
    return wallet.buildEasySendRedeemTransaction(
      input,
      destinationAddress,
      opts
    ).then((testTx) => {

      let rawTxLength = testTx.serialize().length;
      return this.feeService.getCurrentFeeRate(wallet.network).then((feePerKB) => {

        //TODO: Don't use magic numbers
        opts.fee = Math.round((feePerKB * rawTxLength) / 2000);

        return wallet.buildEasySendRedeemTransaction(
          input,
          destinationAddress,
          opts
        );
      });
    }).then((tx) => {
      return wallet.broadcastRawTx({
        rawTx: tx.serialize(),
        network: wallet.network
      });
    }).then((tx) => {
      return this.persistanceService.deletePendingEasyReceipt(receipt);
    });
   }

  private generateEasyScipt(receipt:EasyReceipt, password, network) {

    let secret = this.ledger.hexToString(receipt.secret);
    var receivePrv = this.bwcService.getBitcore().PrivateKey.forEasySend(secret, password);
    var receivePub = this.bwcService.getBitcore().PublicKey.fromPrivateKey(receivePrv).toBuffer();
    var senderPubKey = this.ledger.hexToArray(receipt.senderPublicKey);

    var publicKeys = [
      receivePub,
      senderPubKey
    ];

    var script = this.bwcService.getBitcore().Script.buildEasySendOut(publicKeys, receipt.blockTimeout, network);

    return {
      privateKey: receivePrv,
      publicKey: receivePub,
      script: script
    };
  }
}