export class Errors {
  public static INVALID_BACKUP = {code: 'INVALID_BACKUP', text: 'Invalid backup'};
  public static WALLET_DOES_NOT_EXIST = {code: 'WALLET_DOES_NOT_EXIST', text: 'Wallet does not exist'};
  public static MISSING_PRIVATE_KEY = {code: 'MISSING_PRIVATE_KEY', text: 'Missing private key'};
  public static ENCRYPTED_PRIVATE_KEY = {code: 'ENCRYPTED_PRIVATE_KEY', text: 'Private key is encrypted'};
  public static SERVER_COMPROMISED = {code: 'SERVER_COMPROMISED', text: 'Server compromised'};
  public static COULD_NOT_BUILD_TRANSACTION = {code: 'COULD_NOT_BUILD_TRANSACTION', text: 'Could not build transaction'};
  public static INSUFFICIENT_FUNDS = {code: 'INSUFFICIENT_FUNDS', text: 'Insufficient funds'};
  public static CONNECTION_ERROR = {code: 'CONNECTION_ERROR', text: 'Connection error'};
  public static NOT_FOUND = {code: 'NOT_FOUND', text: 'Not found'};
  public static AUTHENTICATION_ERROR = {code: 'AUTHENTICATION_ERROR', text: 'Authentication Error'};
  public static ECONNRESET_ERROR = {code: 'ECONNRESET_ERROR', text: 'Connection reset'};
  public static WALLET_ALREADY_EXISTS = {code: 'WALLET_ALREADY_EXISTS', text: 'Wallet already exists'};
  public static COPAYER_IN_WALLET = {code: 'COPAYER_IN_WALLET', text: 'Copayer in wallet'};
  public static WALLET_FULL = {code: 'WALLET_FULL', text: 'Wallet full'};
  public static WALLET_NOT_FOUND = {code: 'WALLET_NOT_FOUND', text: 'Wallet not found'};
  public static INSUFFICIENT_FUNDS_FOR_FEE = {code: 'INSUFFICIENT_FUNDS_FOR_FEE', text: 'Insufficient funds for fee'};
  public static LOCKED_FUNDS = {code: 'LOCKED_FUNDS', text: 'Locked funds'};
  public static DUST_AMOUNT = {code: 'DUST_AMOUNT', text: 'Dust amount'};
  public static COPAYER_VOTED = {code: 'COPAYER_VOTED', text: 'Copayer voted'};
  public static NOT_AUTHORIZED = {code: 'NOT_AUTHORIZED', text: 'Not authorized'};
  public static UNAVAILABLE_UTXOS = {code: 'UNAVAILABLE_UTXOS', text: 'Unavaulable UTXOs'};
  public static TX_NOT_FOUND = {code: 'TX_NOT_FOUND', text: 'Transaction not found'};
  public static UNLOCK_CODE_INVALID = {code: 'UNLOCK_CODE_INVALID', text: 'Unlock code invalid'};
  public static MAIN_ADDRESS_GAP_REACHED = {code: 'MAIN_ADDRESS_GAP_REACHED', text: 'Main address gap reached'};
}