export type IGlobalSendHistory = IGlobalSendHistoryItem[];

export interface IGlobalSendHistoryItem {
  id: string;
  walletId: string;
  scriptAddress: string;
  expiresOnBlock: number;
  inviteOnly: boolean;
  cancelled: boolean;
  claimed: boolean;
  claimedBy: string;
  // Encrypted GlobalSend data
  globalSend: string;
}
