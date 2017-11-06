export class Transaction {
  public createdOn: number;
  public id: number;
  public walletId: string;
  public creatorId: string;
  public message: string;
  public changeAddress: any;
  public outputs: any[];
  public inputs: any[];
  public amount: number;
  public toAddress: string;
  public feeLevel: any;
  public network: string;
  public fee: number;

  constructor() {
    console.log("Hello Transaction model.");
  }
}