export class EasyReceipt  {

  unlockCode:string;
  senderName:string;
  secret:string;
  senderPublicKey:string;
  blockTimeout:number;
  deepLinkURL:string;
  checkPassword:boolean;

  constructor(fields:any) {
    for (const f in fields) {
      this[f] = fields[f];
    }
  } 
  
  isValid() {
    return (
      this.unlockCode 
      && this.senderPublicKey 
      && this.secret 
      && this.blockTimeout
    );
  }

}