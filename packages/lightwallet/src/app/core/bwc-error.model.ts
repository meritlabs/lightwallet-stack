import { Injectable } from '@angular/core';
import { Logger } from 'merit/core/logger';


@Injectable()
export class BwcError {

  constructor(private log: Logger,) {
    this.log.info('Hello BwcError model');
  }


  //TODO
  public msg(err: any, prefix?: string): string {
    return `bwcError: ${prefix} ${err}`;
  }

  public cb(err: string, prefix?: string): string {
    return this.msg(err, prefix);
  };

  private getErrorText(name: string): string {
    switch (name) {
      case 'INVALID_BACKUP':
        return 'Wallet Recovery Phrase is invalid';

      case 'WALLET_DOES_NOT_EXIST':
        return 'Wallet not registered at the wallet service. Recreate it fro "Create Wallet" using "Advanced Options" to set your recovery phrase';

      case 'MISSING_PRIVATE_KEY':
        return 'Missing private keys to sign';

      case 'ENCRYPTED_PRIVATE_KEY':
        return 'Private key is encrypted, cannot sign';

      case 'SERVER_COMPROMISED':
        return 'Server response could not be verified';

      case 'COULD_NOT_BUILD_TRANSACTION':
        return 'Could not build transaction';

      case 'INSUFFICIENT_FUNDS':
        return 'Insufficient funds';

      case 'CONNECTION_ERROR':
        return 'Network error';

      case 'NOT_FOUND':
        return 'Wallet service not found';

      case 'ECONNRESET_ERROR':
        return 'Connection reset by peer';

      case 'BAD_RESPONSE_CODE':
        return 'The request could not be understood by the server';

      case 'WALLET_ALREADY_EXISTS':
        return 'Wallet already exists';

      case 'COPAYER_IN_WALLET':
        return 'Copayer already in this wallet';

      case 'WALLET_FULL':
        return 'Wallet is full';

      case 'WALLET_NOT_FOUND':
        return 'Wallet not found';

      case 'INSUFFICIENT_FUNDS_FOR_FEE':
        return 'Insufficient funds for fee';

      case 'LOCKED_FUNDS':
        return 'Funds are locked by pending spend proposals';

      case 'COPAYER_VOTED':
        return 'Copayer already voted on this spend proposal';

      case 'NOT_AUTHORIZED':
        return 'Not authorized';

      case 'TX_ALREADY_BROADCASTED':
        return 'Transaction already broadcasted';

      case 'TX_CANNOT_CREATE':
        return 'Locktime in effect. Please wait to create a new spend proposal';

      case 'TX_CANNOT_REMOVE':
        return 'Locktime in effect. Please wait to remove this spend proposal';

      case 'TX_NOT_ACCEPTED':
        return 'Spend proposal is not accepted';

      case 'TX_NOT_FOUND':
        return 'Spend proposal not found';

      case 'TX_NOT_PENDING':
        return 'The spend proposal is not pending';

      case 'UPGRADE_NEEDED':
        return 'Please upgrade Copay to perform this action';

      case 'BAD_SIGNATURES':
        return 'Signatures rejected by server';

      case 'COPAYER_DATA_MISMATCH':
        return 'Copayer data mismatch';

      case 'DUST_AMOUNT':
        return 'Amount below minimum allowed';

      case 'INCORRECT_ADDRESS_NETWORK':
        return 'Incorrect network address';

      case 'COPAYER_REGISTERED':
        return 'Key already associated with an existing wallet';

      case 'INVALID_ADDRESS':
        return 'Invalid address';

      case 'MAIN_ADDRESS_GAP_REACHED':
        return 'Empty addresses limit reached. New addresses cannot be generated.';

      case 'WALLET_LOCKED':
        return 'Wallet is locked';

      case 'WALLET_NOT_COMPLETE':
        return 'Wallet is not complete';

      case 'WALLET_NEEDS_BACKUP':
        return 'Wallet needs backup';

      case 'MISSING_PARAMETER':
        return 'Missing parameter';

      case 'NO_PASSWORD_GIVEN':
        return 'Spending Password needed';

      case 'PASSWORD_INCORRECT':
        return 'Wrong spending password';

      case 'EXCEEDED_DAILY_LIMIT':
        return 'Exceeded daily limit of $500 per user';

      case 'UNLOCK_CODE_INVALID':
        return 'That Unlock Code is not valid';

      case 'ERROR':
        return 'Error';

      default:
        this.log.warn('Unknown error type:', name);
        return 'Unknown error type.';
    }
  }
}
