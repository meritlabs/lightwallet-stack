export class EasyReceipt  {

  senderName: '';
  checkPassword:boolean;

  constructor(fields:any) {
    for (const f in fields) {
      this[f] = fields[f];
    }
  } 

}