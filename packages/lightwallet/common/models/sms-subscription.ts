export interface ISmsNotificationStatus {
  enabled: boolean;
  phoneNumber?: string;
  platform?: string;
  walletId?: string;
  settings?: ISmsNotificationSettings;
}

export type ISmsNotificationSettings = { [k in keyof typeof SmsNotificationSetting]?: boolean };

export enum SmsNotificationSetting {
  IncomingTx = 'IncomingTx',
  IncomingInvite = 'IncomingInvite',
  IncomingInviteRequest = 'IncomingInviteRequest',
  WalletUnlocked = 'WalletUnlocked',
  MiningReward = 'MiningReward',
  GrowthReward = 'GrowthReward',
  IncomingPoolPayment = 'IncomingPoolPayment',
  MarketPayment = 'MarketPayment',
}
