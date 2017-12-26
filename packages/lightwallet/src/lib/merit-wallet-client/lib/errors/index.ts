export class Errors {
  public static INVALID_BACKUP = {code: 'INVALID_BACKUP', text: 'Invalid backup'};
  public static WALLET_DOES_NOT_EXIST = {code: 'WALLET_DOES_NOT_EXIST', text: 'Wallet does not exist'};
  public static MISSING_PRIVATE_KEY = {code: 'MISSING_PRIVATE_KEY', text: 'Missing private keys to sign'};
  public static ENCRYPTED_PRIVATE_KEY = {code: 'ENCRYPTED_PRIVATE_KEY', text: 'Private key is encrypted, cannot sign transaction'};
  public static SERVER_COMPROMISED = {code: 'SERVER_COMPROMISED', text: 'Server response could not be verified'};
  public static COULD_NOT_BUILD_TRANSACTION = {code: 'COULD_NOT_BUILD_TRANSACTION', text: 'Could not build the transaction'};
  public static INSUFFICIENT_FUNDS = {code: 'INSUFFICIENT_FUNDS', text: 'Insufficient funds'};
  public static CONNECTION_ERROR = {code: 'CONNECTION_ERROR', text: 'Connection error'};
  public static NOT_FOUND = {code: 'NOT_FOUND', text: 'Not found'};
  public static AUTHENTICATION_ERROR = {code: 'AUTHENTICATION_ERROR', text: 'Authentication Error'};
  public static ECONNRESET_ERROR = {code: 'ECONNRESET_ERROR', text: 'Connection reset'};
  public static WALLET_ALREADY_EXISTS = {code: 'WALLET_ALREADY_EXISTS', text: 'Wallet already exists'};
  public static COPAYER_IN_WALLET = {code: 'COPAYER_IN_WALLET', text: 'Copayer in wallet'};
  public static WALLET_FULL = {code: 'WALLET_FULL', text: 'Wallet is full'};
  public static WALLET_NOT_FOUND = {code: 'WALLET_NOT_FOUND', text: 'Wallet not found'};
  public static INSUFFICIENT_FUNDS_FOR_FEE = {code: 'INSUFFICIENT_FUNDS_FOR_FEE', text: 'Insufficient funds for fee'};
  public static LOCKED_FUNDS = {code: 'LOCKED_FUNDS', text: 'Locked funds'};
  public static DUST_AMOUNT = {code: 'DUST_AMOUNT', text: 'Amount below dust threshold'};
  public static COPAYER_VOTED = {code: 'COPAYER_VOTED', text: 'Copayer already voted on this transaction proposal'};
  public static NOT_AUTHORIZED = {code: 'NOT_AUTHORIZED', text: 'Not authorized'};
  public static UNAVAILABLE_UTXOS = {code: 'UNAVAILABLE_UTXOS', text: 'Unavailable unspent outputs'};
  public static TX_NOT_FOUND = {code: 'TX_NOT_FOUND', text: 'Transaction proposal not found'};
  public static REFERRER_INVALID = {code: 'REFERRER_INVALID', text: 'Invalid referrer address'};
  public static MAIN_ADDRESS_GAP_REACHED = {code: 'MAIN_ADDRESS_GAP_REACHED', text: 'Maximum number of consecutive addresses without activity reached'};
  public static SERVER_UNAVAILABLE = {code: 'SERVER_UNAVAILABLE', text: 'Could not reach the server'};
  public static INVALID_REFERRAL = {code: 'INVALID_REFERRAL', text: 'Referral is not valid'};
}
