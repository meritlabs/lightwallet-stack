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
      receipt.parentAddress = params.pa;
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
    return new Promise((resolve, reject) => {
      return this.persistanceService.getPendingsEasyReceipts().then((receipts) => {
          if (!receipts) receipts = [];
          return resolve(receipts);
      });
    });

  }

  public acceptEasyReceipt(receipt: EasyReceipt, wallet: MeritWalletClient, input: number, destinationAddress: any): Promise<void>  {
      return this.spendEasyReceipt(receipt, wallet, input, destinationAddress);
  }


  public rejectEasyReceipt(wallet, receipt:EasyReceipt, input):Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        let senderAddress = this.bwcService.getBitcore().PublicKey
        .fromString(receipt.senderPublicKey, 'hex')
        .toAddress(wallet.network)
        .toString();

        return this.spendEasyReceipt(receipt, wallet, input, senderAddress);
      } catch (e) {
        return reject(e);
      }
    })
  }

  public validateEasyReceiptOnBlockchain(receipt:EasyReceipt, password = '', network = this.configService.getDefaults().network.name):Promise<any> {

    return new Promise((resolve, reject) => {
      const opts:any = {
        bwsurl: this.configService.getDefaults().bws.url
      };
      const walletClient = this.bwcService.getClient(null, opts);
      let onBlockChain = false;

      const scriptData = this.generateEasyScipt(receipt, password, network);
      const scriptAddress = this.bwcService.getBitcore().Address(scriptData.script.getAddressInfo()).toString();

      return walletClient.validateEasyScript(scriptAddress).then((txn) => {
        if (txn.result.found == false) {
          this.logger.warn("Could not validate easyScript on the blockchain.");
          return resolve(false);
        } else {
          return resolve({
            senderPublicKey: receipt.senderPublicKey,
            txn: txn.result,
            privateKey: scriptData.privateKey,
            publicKey: scriptData.publicKey,
            script: scriptData.script,
            scriptId: scriptAddress,
          });
        }
      }).catch((err) => {
        this.logger.warn("Could not validate easyScript on the blockchain.", err);
        return resolve(false);
      });

    });
  }

  public deletePendingReceipt(receipt:EasyReceipt) {
    return this.persistanceService.deletePendingEasyReceipt(receipt);
  }

  private spendEasyReceipt(receipt:EasyReceipt, wallet:MeritWalletClient, input:number, destinationAddress:any):Promise<void> {
     return new Promise((resolve, reject) => {
       let opts:any = {};
       let testTx = wallet.buildEasySendRedeemTransaction(
         input,
         destinationAddress.address,
         opts

       );

       let rawTxLength = testTx.serialize().length;
       return this.feeService.getCurrentFeeRate(wallet.network).then((feePerKB) => {

         //TODO: Don't use magic numbers
         opts.fee = Math.round((feePerKB * rawTxLength) / 2000);

         let tx = wallet.buildEasySendRedeemTransaction(
           input,
           destinationAddress.address,
           opts
         );

         return wallet.broadcastRawTx({
           rawTx: tx.serialize(),
           network: wallet.network
         }).then((tx) => {
           return this.persistanceService.deletePendingEasyReceipt(receipt).then(() => {
               return resolve();
           });
         })
       });
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
      script: script.toMixedScriptHashOut(senderPubKey)
    };
  }
}
