import {Wallet} from "../wallet";
export class WalletMock extends Wallet {

  id:string = '1';
  name:string =  'Wallet Mock';
  status:Object = {totalBalanceStr: '0 bits', totalBalanceAlternative: '0.0', alternativeIsoCode: 'USD', totalBalanceMicros: 0, spendableAmount: 0};
  balanceHidden:boolean =  false;
  color:string=  'darkred';
  locked:boolean = false;
  cachedBalance:string;
  cachedBalanceUpdatedOn:number;
  m:number = 1;
  n:number = 1;
  secret: string = "donkey";
  error:string = "Error";
  copayers:Array<any> = [{id: '1', name: 'test copayer'}];

  private _isComplete = true;
  private _canSign = true;
  private _isComgetPrivKeyExternalSourceNameplete = true;
  private _isPrivKeyExternal = true;
  private _isPrivKeyEncrypted = true;

  isComplete = () => {
    return this._isComplete;
  };
  canSign = () => {
    return this._canSign;
  };
  getPrivKeyExternalSourceName = () => {
    return this._isComgetPrivKeyExternalSourceNameplete;
  };
  isPrivKeyExternal = () => {
    return this._isPrivKeyExternal;
  };
  isPrivKeyEncrypted = () => {
    return this._isPrivKeyEncrypted;
  };

  constructor(fields:any) {
    super(fields);
    for (const f in fields) {
      this[f] = fields[f];
    }
  }
}