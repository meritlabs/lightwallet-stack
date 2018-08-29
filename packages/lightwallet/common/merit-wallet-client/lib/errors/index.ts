export class MwcError extends Error {
  constructor(public code, public text) {
    super(text);
  }
}


export class MWCErrors {
  public static INVALID_BACKUP = new MwcError('INVALID_BACKUP', 'Invalid backup');
  public static WALLET_DOES_NOT_EXIST = new MwcError('WALLET_DOES_NOT_EXIST', 'Wallet does not exist');
  public static MISSING_PRIVATE_KEY = new MwcError('MISSING_PRIVATE_KEY', 'Missing private keys to sign');
  public static ENCRYPTED_PRIVATE_KEY = new MwcError('ENCRYPTED_PRIVATE_KEY', 'Private key is encrypted, cannot sign transaction');
  public static SERVER_COMPROMISED = new MwcError('SERVER_COMPROMISED', 'Server response could not be verified');
  public static COULD_NOT_BUILD_TRANSACTION = new MwcError('COULD_NOT_BUILD_TRANSACTION', 'Could not build the transaction');
  public static INSUFFICIENT_FUNDS = new MwcError('INSUFFICIENT_FUNDS', 'Insufficient funds');
  public static CONNECTION_ERROR = new MwcError('CONNECTION_ERROR', 'Connection error');
  public static NOT_FOUND = new MwcError('NOT_FOUND', 'Not found');
  public static AUTHENTICATION_ERROR = new MwcError('AUTHENTICATION_ERROR', 'Authentication Error');
  public static ECONNRESET_ERROR = new MwcError('ECONNRESET_ERROR', 'Connection reset');
  public static WALLET_ALREADY_EXISTS = new MwcError('WALLET_ALREADY_EXISTS', 'Wallet already exists');
  public static COPAYER_IN_WALLET = new MwcError('COPAYER_IN_WALLET', 'Copayer in wallet');
  public static WALLET_FULL = new MwcError('WALLET_FULL', 'Wallet is full');
  public static WALLET_NOT_FOUND = new MwcError('WALLET_NOT_FOUND', 'Wallet not found');
  public static INSUFFICIENT_FUNDS_FOR_FEE = new MwcError('INSUFFICIENT_FUNDS_FOR_FEE', 'Insufficient funds for fee');
  public static LOCKED_FUNDS = new MwcError('LOCKED_FUNDS', 'Locked funds');
  public static DUST_AMOUNT = new MwcError('DUST_AMOUNT', 'Amount below dust threshold');
  public static COPAYER_VOTED = new MwcError('COPAYER_VOTED', 'Copayer already voted on this transaction proposal');
  public static NOT_AUTHORIZED = new MwcError('NOT_AUTHORIZED', 'Not authorized');
  public static UNAVAILABLE_UTXOS = new MwcError('UNAVAILABLE_UTXOS', 'Unavailable unspent outputs');
  public static TX_NOT_FOUND = new MwcError('TX_NOT_FOUND', 'Transaction proposal not found');
  public static INVALID_REFERRAL = new MwcError('INVALID_REFERRAL', 'Invalid referral');
  public static REFERRER_INVALID = new MwcError('REFERRER_INVALID', 'Invalid referrer address');
  public static MAIN_ADDRESS_GAP_REACHED = new MwcError('MAIN_ADDRESS_GAP_REACHED', 'Maximum number of consecutive addresses without activity reached');
  public static SERVER_UNAVAILABLE = new MwcError('SERVER_UNAVAILABLE', 'Could not reach the server');
  public static TX_MAX_SIZE_EXCEEDED = new MwcError('TX_MAX_SIZE_EXCEEDED', 'Maximum size of transaction exceeded');
}
