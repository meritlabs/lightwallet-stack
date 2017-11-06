export class TransactionProposal {
  
  
  // Core Params..
  public createdOn: number;
  public id: number;
  public walletId: string;
  public creatorId: string;
  public message: string;
  public changeAddress: any;
  public outputs: any[];
  public inputs: any[];
  public network: string;
  public fee: number;
  public toAddress: string;
  public amount: string;
  public description: string;
  public sendMax: boolean = false;
  public feeLevel: any;
  public allowSpendUnconfirmed: boolean = true; // TODO: Consider removing entirely.

  // Vanity Params -- Not on the blockchain; but we use convenience and usability.
  public recipientType: any; // TODO: Define type
  public toName: string;
  public toEmail: string;
  public toPhoneNumber: string;
  public toColor: string;
  public usingCustomFee: boolean = false;


  constructor() {
    console.log("Hello Transaction model.");
  }
}