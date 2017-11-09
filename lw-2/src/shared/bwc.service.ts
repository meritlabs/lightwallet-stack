import { Injectable } from '@angular/core';

import * as BWC from '../../external/bwc';
import {LoggerService} from "./logger.service";

/**
 *  @DISCUSS This service is more like a factory. Should we rename it?
 *  Alternative idea: make it singleton, instantiate BWC in constructor and proxy all BWC calls.
 */
@Injectable()
export class BwcService {
  public buildTx = BWC.buildTx;
  public parseSecret = BWC.parseSecret;
  public Client = BWC;

  constructor(
    private logger:LoggerService
  ) {
  }

  getBitcore() {
    return BWC.Bitcore;
  }

  getErrors() {
    return BWC.errors;
  }

  getSJCL() {
    return BWC.sjcl;
  }

  getUtils() {
    return BWC.Utils;
  }

  getErrorText(errorCode:any) {


    //todo temp
    if (errorCode.message.indexOf('bwc.Error') != -1) errorCode.message = errorCode.message.slice(errorCode.indexOf('bwc.Error'));

    /**
     * @DISCUSS move to external i18n file with some prefix? And load with translationService
     *
     * @DISCUSS this method doesn't meet the single responsibility principle. Mb we should move it to another class like `bwcErrorHandler`?
     *
     * */
    let errorCatalog = {
      'INVALID_BACKUP': 'Wallet Recovery Phrase is invalid',
      'WALLET_DOES_NOT_EXIST': 'Wallet not registered at the wallet service. Recreate it fro "Create Wallet" using "Advanced Options" to set your recovery phrase',
      'MISSING_PRIVATE_KEY': 'Missing private keys to sign',
      'ENCRYPTED_PRIVATE_KEY': 'Private key is encrypted, cannot sign',
      'SERVER_COMPROMISED': 'Server response could not be verified',
      'COULD_NOT_BUILD_TRANSACTION': 'Could not build transaction',
      'INSUFFICIENT_FUNDS': 'Insufficient funds',
      'CONNECTION_ERROR': 'Network error',
      'NOT_FOUND': 'Wallet service not found',
      'ECONNRESET_ERROR': 'Connection reset by peer',
      'BAD_RESPONSE_CODE': 'The request could not be understood by the server',
      'WALLET_ALREADY_EXISTS': 'Wallet already exists',
      'COPAYER_IN_WALLET': 'Copayer already in this wallet',
      'WALLET_FULL': 'Wallet is full',
      'WALLET_NOT_FOUND': 'Wallet not found',
      'INSUFFICIENT_FUNDS_FOR_FEE': 'Insufficient funds for fee',
      'LOCKED_FUNDS': 'Funds are locked by pending spend proposals',
      'COPAYER_VOTED': 'Copayer already voted on this spend proposal',
      'NOT_AUTHORIZED': 'Not authorized',
      'TX_ALREADY_BROADCASTED': 'Transaction already broadcasted',
      'TX_CANNOT_CREATE': 'Locktime in effect. Please wait to create a new spend proposal',
      'TX_CANNOT_REMOVE': 'Locktime in effect. Please wait to remove this spend proposal',
      'TX_NOT_ACCEPTED': 'Spend proposal is not accepted',
      'TX_NOT_FOUND': 'Spend proposal not found',
      'TX_NOT_PENDING': 'The spend proposal is not pending',
      'UPGRADE_NEEDED': 'Please upgrade Copay to perform this action',
      'BAD_SIGNATURES': 'Signatures rejected by server',
      'COPAYER_DATA_MISMATCH': 'Copayer data mismatch',
      'DUST_AMOUNT': 'Amount below minimum allowed',
      'INCORRECT_ADDRESS_NETWORK': 'Incorrect network address',
      'COPAYER_REGISTERED': 'Key already associated with an existing wallet',
      'INVALID_ADDRESS': 'Invalid address',
      'MAIN_ADDRESS_GAP_REACHED': 'Empty addresses limit reached. New addresses cannot be generated',
      'WALLET_LOCKED': 'Wallet is locked',
      'WALLET_NOT_COMPLETE': 'Wallet is not complete',
      'WALLET_NEEDS_BACKUP': 'Wallet needs backup',
      'MISSING_PARAMETER': 'Missing parameter',
      'NO_PASSWORD_GIVEN': 'Spending Password needed',
      'PASSWORD_INCORRECT': 'Wrong spending password',
      'EXCEEDED_DAILY_LIMIT': 'Exceeded daily limit of $500 per user',
      'UNLOCK_CODE_INVALID': 'That Unlock Code is not valid',
      'ERROR': 'Error'
    };

    let error = errorCatalog[errorCode.message];
    if (!error) {
      this.logger.warn(`Unknown error type ${errorCode.message}`);
      error = 'Unknown error';
    }

    return error;

  }

  getClient(walletData, opts) {
    opts = opts || {};

    //note opts use `bwsurl` all lowercase;
    let bwc = new BWC({
      //baseUrl: opts.bwsurl || 'https://mws.merit.me/mws/api',
      baseUrl: opts.bwsurl || 'http://localhost:3232/bws/api',
      verbose: opts.verbose,
      timeout: 100000,
      transports: ['polling'],
    });
    if (walletData)
      bwc.import(walletData, opts);
    return bwc;
  }

}
