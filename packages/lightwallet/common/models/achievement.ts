export enum AchievementTask {
  InviteFriends = 'invite_friends',
  GetInviteRequest = 'get_invite_request',
  ConfirmInviteRequest = 'confirm_invite_request',
  MineInvite = 'mine_invite',
  UnlockWallet = 'unlock_wallet',
}

export interface Achievement {
  id: string;
  goalId: string;
  slug: number;
  route: string;
  name: string;
  description: string;
  title: string;
  linkTitle: string;
  image: string;
  conditions: IAchievementTask[];
}

export interface IAchievementTask {
  slug: AchievementTask;
  name?: string;
  status?: boolean;
}

export interface IAchievements {
  achievements: Achievement[];
  token: string;
  settings: IAchievementSettings;
}

export interface IAchievementSettings {
  isSetupTrackerEnabled: boolean;
  isWelcomeDialogEnabled: boolean;
}
