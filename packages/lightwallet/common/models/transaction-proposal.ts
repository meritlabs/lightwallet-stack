export interface TransactionProposal {
  // Core Params..
  createdOn: number;
  id: string;
  walletId: string;
  creatorId: string;
  message: string;
  changeAddress: any;
  outputs: any[];
  inputs: any[];
  network: string;
  fee: number;
  toAddress: string;
  toAmount: string;
  description: string;
  sendMax: boolean;
  feeLevel: any;
  allowSpendUnconfirmed: boolean; // TODO: Consider removing entirely.
  // Vanity Params -- Not on the blockchain; but we use convenience and usability.
  recipientType?: any; // TODO: Define type
  toName?: string;
  toEmail?: string;
  toPhoneNumber?: string;
  toColor?: string;
  usingCustomFee?: boolean;
}
