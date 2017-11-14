export interface BwcError extends Error {
  readonly message: string;
  readonly stack: string;
  readonly name: string;
}

export interface BwcErrorConstructor {
  new (message: string): BwcError;
  readonly prototype: BwcError;
}

export const BwcError: BwcErrorConstructor = <any>class BwcError {
  readonly prototype = Object.create(Error.prototype);
  public constructor(message: string) {
    Object.defineProperty(this, 'name', {
      get: () => (this.constructor as any).name,
    });
    Object.defineProperty(this, 'message', {
      get: () => message,
    });
    Error.captureStackTrace(this, this.constructor);
  }
};

// (BwcError as any).prototype = Object.create(Error.prototype);
// BwcError.prototype.constructor = BwcError;

export module ErrorTypes {
  export const INVALID_BACKUP = new BwcError('Invalid backup.');
  export const WALLET_DOES_NOT_EXIST = new BwcError('Wallet does not exist.');
  export const MISSING_PRIVATE_KEY = new BwcError('Missing private key.');
  export const ENCRYPTED_PRIVATE_KEY = new BwcError('Private key is encrypted.');
  export const SERVER_COMPROMISED = new BwcError('Server compromised.');
  export const COULD_NOT_BUILD_TRANSACTION = new BwcError('Could not build transaction.');
  export const INSUFFICIENT_FUNDS = new BwcError('Insufficient funds.');
  export const CONNECTION_ERROR = new BwcError('Connection error.');
  export const NOT_FOUND = new BwcError('Not found.');
  export const ECONNRESET_ERROR = new BwcError('Connection reset.');
  export const WALLET_ALREADY_EXISTS = new BwcError('Wallet already exists.');
  export const COPAYER_IN_WALLET = new BwcError('Copayer in wallet.');
  export const WALLET_FULL = new BwcError('Wallet full.');
  export const WALLET_NOT_FOUND = new BwcError('Wallet not found.');
  export const INSUFFICIENT_FUNDS_FOR_FEE = new BwcError('Insufficient funds for fee.');
  export const LOCKED_FUNDS = new BwcError('Locked funds.');
  export const DUST_AMOUNT = new BwcError('Dust amount.');
  export const COPAYER_VOTED = new BwcError('Copayer voted.');
  export const NOT_AUTHORIZED = new BwcError('Not authorized.');
  export const UNAVAILABLE_UTXOS = new BwcError('Unavaulable UTXOs.');
  export const TX_NOT_FOUND = new BwcError('Transaction not found.');
  export const UNLOCK_CODE_INVALID = new BwcError('Unlock code invalid.');
  export const MAIN_ADDRESS_GAP_REACHED = new BwcError('Main address gap reached.');
}


