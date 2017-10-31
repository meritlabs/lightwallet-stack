export class Wallet {

  id:string;
  name:string;
  status:any;
  balanceHidden:boolean;
  color:string;
  locked:boolean;
  cachedBalance:string;
  cachedBalanceUpdatedOn:number;
  m:number;
  n:number;
  error:string;
  secret:string;
  notAuthorized:boolean;
  copayers:Array<any>;

  isComplete = ():boolean => {
    //TODO IMPLEMENT
    return true;
  };
  canSign = ():boolean => {
    //TODO IMPLEMENT
    return true;
  };
  getPrivKeyExternalSourceName = ():boolean => {
    //TODO IMPLEMENT
    return true;
  };
  isPrivKeyExternal = ():boolean => {
    //TODO IMPLEMENT
    return true;
  };
  isPrivKeyEncrypted = ():boolean => {
    //TODO IMPLEMENT
    return true;
  };


  constructor(fields:any) {
    for (const f in fields) {
      this[f] = fields[f];
    }
  }

}