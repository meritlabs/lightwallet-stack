import { Injectable } from '@angular/core';
import { Logger } from '@nsalaun/ng-logger';


@Injectable()
export class BwcError {

  constructor(
    private log: Logger, 
  ) { 
    console.log('Hello BwcError model');
  }


  //TODO
  public msg(err: any, prefix?: string): string {
    return "TODO: bwcError msg(err, prefix)";
  }

  public cb(err: string, prefix?: string): Promise<any> {
    return new Promise((resolve, reject)=> {
      resolve(this.msg(err, prefix));
    });      
  };

  private getErrorText(name: string): string {
      // TODO: Unify internationalization text providers.
      let body = "";

      if (name) {
          switch (name) {
            case 'INVALID_BACKUP':
              body = 'Wallet Recovery Phrase is invalid';
              break;
            case 'WALLET_DOES_NOT_EXIST':
              body = 'Wallet not registered at the wallet service. Recreate it fro "Create Wallet" using "Advanced Options" to set your recovery phrase');
              break;
            case 'MISSING_PRIVATE_KEY':
              body = 'Missing private keys to sign';
              break;
            case 'ENCRYPTED_PRIVATE_KEY':
              body = 'Private key is encrypted, cannot sign';
              break;
            case 'SERVER_COMPROMISED':
              body = 'Server response could not be verified';
              break;
            case 'COULD_NOT_BUILD_TRANSACTION':
              body = 'Could not build transaction';
              break;
            case 'INSUFFICIENT_FUNDS':
              body = 'Insufficient funds';
              break;
            case 'CONNECTION_ERROR':
              body = 'Network error';
              break;
            case 'NOT_FOUND':
              body = 'Wallet service not found';
              break;
            case 'ECONNRESET_ERROR':
              body = 'Connection reset by peer';
              break;
            case 'BAD_RESPONSE_CODE':
              body = 'The request could not be understood by the server';
              break;
            case 'WALLET_ALREADY_EXISTS':
              body = 'Wallet already exists';
              break;
            case 'COPAYER_IN_WALLET':
              body = 'Copayer already in this wallet';
              break;
            case 'WALLET_FULL':
              body = 'Wallet is full';
              break;
            case 'WALLET_NOT_FOUND':
              body = 'Wallet not found';
              break;
            case 'INSUFFICIENT_FUNDS_FOR_FEE':
              body = 'Insufficient funds for fee';
              break;
            case 'LOCKED_FUNDS':
              body = 'Funds are locked by pending spend proposals';
              break;
            case 'COPAYER_VOTED':
              body = 'Copayer already voted on this spend proposal';
              break;
            case 'NOT_AUTHORIZED':
              body = 'Not authorized';
              break;
            case 'TX_ALREADY_BROADCASTED':
              body = 'Transaction already broadcasted';
              break;
            case 'TX_CANNOT_CREATE':
              body = 'Locktime in effect. Please wait to create a new spend proposal';
              break;
            case 'TX_CANNOT_REMOVE':
              body = 'Locktime in effect. Please wait to remove this spend proposal';
              break;
            case 'TX_NOT_ACCEPTED':
              body = 'Spend proposal is not accepted';
              break;
            case 'TX_NOT_FOUND':
              body = 'Spend proposal not found';
              break;
            case 'TX_NOT_PENDING':
              body = 'The spend proposal is not pending';
              break;
            case 'UPGRADE_NEEDED':
              body = 'Please upgrade Copay to perform this action';
              break;
            case 'BAD_SIGNATURES':
              body = 'Signatures rejected by server';
              break;
            case 'COPAYER_DATA_MISMATCH':
              body = 'Copayer data mismatch';
              break;
            case 'DUST_AMOUNT':
              body = 'Amount below minimum allowed';
              break;
            case 'INCORRECT_ADDRESS_NETWORK':
              body = 'Incorrect network address';
              break;
            case 'COPAYER_REGISTERED':
              body = 'Key already associated with an existing wallet';
              break;
            case 'INVALID_ADDRESS':
              body = 'Invalid address';
              break;
            case 'MAIN_ADDRESS_GAP_REACHED':
              body = 'Empty addresses limit reached. New addresses cannot be generated.);
              break;
            case 'WALLET_LOCKED':
              body = 'Wallet is locked';
              break;
            case 'WALLET_NOT_COMPLETE':
              body = 'Wallet is not complete';
              break;
            case 'WALLET_NEEDS_BACKUP':
              body = 'Wallet needs backup';
              break;
            case 'MISSING_PARAMETER':
              body = 'Missing parameter';
              break;
            case 'NO_PASSWORD_GIVEN':
              body = 'Spending Password needed';
              break;
            case 'PASSWORD_INCORRECT':
              body = 'Wrong spending password';
              break;
            case 'EXCEEDED_DAILY_LIMIT':
              body = 'Exceeded daily limit of $500 per user';
              break;
            case 'UNLOCK_CODE_INVALID':
              body = 'That Unlock Code is not valid';
              break;
            case 'ERROR':
              body = "Error";
              break;
  
            default:
              this.log.warn('Unknown error type:', name);
              body = "Unknown error type.";
              break;
          }
      } else {
          body = "Unknown error type.";
      }
    return body;  
  } 
}
