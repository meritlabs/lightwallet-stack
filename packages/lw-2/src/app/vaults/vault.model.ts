export class Vault {

  id:string;
  name:string;
  status:any;


  constructor(fields:any) {
    for (const f in fields) {
        this[f] = fields[f];
    }
  }

}