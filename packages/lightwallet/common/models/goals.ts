export enum TaskSlug {
  // Creator
  CreateWallet = 'create-wallet',
  UnlockWallet = 'unlock-wallet',

  // FastStarter
  InviteFriends = 'invite-friends',
  ReceiveInviteRequest = 'receive-invite-request',
  MineInvite = 'mine-invite',
  ConfirmInviteRequest = 'confirm-invite-request',
}

export enum GoalSlug {
  Creator = 'creator',
  FastStarter = 'fast-starter',
  MeritTycoon = 'merit-tycoon',
  GrowthMaster = 'growth-master',
}

export interface ITask {
  slug: TaskSlug;
  name: string;
  description: string;
}

export interface ITaskProgress {
  slug: TaskSlug;
  status: ProgressStatus;
}

export type IFullTask = ITask & ITaskProgress;

export interface IGoal {
  slug: GoalSlug;
  name: string;
  description: string;
  image: string;
  tasks: ITask[];
}

export interface IFullGoal extends IGoal {
  route: string;
  title: string;
  linkTitle: string;
  tasks: IFullTask[];
  status: ProgressStatus;
}

export enum ProgressStatus {
  Incomplete = 0,
  InProgress,
  Complete,
}

export interface IProgress {
  userId?: string;
  tasks?: ITaskProgress[];
}

export interface IFullProgress extends IProgress {
  goals: IFullGoal[];
}

export interface IGoalSettings {
  id?: string;
  userId?: string;
  isSetupTrackerEnabled: boolean;
  isWelcomeDialogEnabled: boolean;
}
