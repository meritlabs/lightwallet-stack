export interface ISmsNotificationStatus {
  enabled: boolean;
  phoneNumber?: string;
  platform?: string;
  walletId?: string;
  settings?: ISmsNotificationSettings;
}

export type ISmsNotificationSettings = {
  [k in keyof typeof SmsNotificationSetting]?: boolean;
};

export enum SmsNotificationSetting {
  IncomingTx = 'incoming_tx',
  IncomingInvite = 'incoming_invite',
  IncomingInviteRequest = 'incoming_invite_request',
  WalletUnlocked = 'wallet_unlocked',
  MiningReward = 'mining_reward',
  GrowthReward = 'growth_reward',
  IncomingPoolPayment = 'incoming_pool_payment',
  MarketPayment = 'market_payment',
}
