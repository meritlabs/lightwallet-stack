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

(BwcError as any).prototype = Object.create(Error.prototype);
BwcError.prototype.constructor = BwcError;

export module ErrorTypes {
  export const INVALID_BACKUP = new BwcError('Invalid Backup.');  
  export const WALLET_DOES_NOT_EXIST = new BwcError('Invalid Backup.');  
  export const MISSING_PRIVATE_KEY = new BwcError('Invalid Backup.');  
  export const ENCRYPTED_PRIVATE_KEY = new BwcError('Invalid Backup.');  
  export const SERVER_COMPROMISED = new BwcError('Invalid Backup.');  
  export const COULD_NOT_BUILD_TRANSACTION = new BwcError('Invalid Backup.');  
  export const INSUFFICIENT_FUNDS = new BwcError('Invalid Backup.');  
  export const CONNECTION_ERROR = new BwcError('Invalid Backup.');  
  export const NOT_FOUND = new BwcError('Invalid Backup.');  
  export const ECONNRESET_ERROR = new BwcError('Invalid Backup.');  
  export const WALLET_ALREADY_EXISTS = new BwcError('Invalid Backup.');  
  export const COPAYER_IN_WALLET = new BwcError('Invalid Backup.');  
  export const WALLET_FULL = new BwcError('Invalid Backup.');  
  export const WALLET_NOT_FOUND = new BwcError('Invalid Backup.');  
  export const INSUFFICIENT_FUNDS_FOR_FEE = new BwcError('Invalid Backup.');  
  export const LOCKED_FUNDS = new BwcError('Invalid Backup.');  
  export const DUST_AMOUNT = new BwcError('Invalid Backup.');  
  export const COPAYER_VOTED = new BwcError('Invalid Backup.');  
  export const NOT_AUTHORIZED = new BwcError('Invalid Backup.');  
  export const UNAVAILABLE_UTXOS = new BwcError('Invalid Backup.');  
  export const TX_NOT_FOUND = new BwcError('Invalid Backup.');  
  export const UNLOCK_CODE_INVALID = new BwcError('Invalid Backup.');  
  export const MAIN_ADDRESS_GAP_REACHED = new BwcError('Invalid Backup.');  
}


