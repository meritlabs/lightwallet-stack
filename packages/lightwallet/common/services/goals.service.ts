import { Injectable } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { RefreshGoalSettingsAction, RefreshGoalsProgressAction } from '@merit/common/reducers/goals.reducer';
import { selectWalletById, selectWallets } from '@merit/common/reducers/wallets.reducer';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { IRootAppState } from '@merit/common/reducers';
import { getLatestValue } from '@merit/common/utils/observables';
import { Store } from '@ngrx/store';
import { selectPrimaryWallet } from '@merit/common/reducers/interface-preferences.reducer';
import { take } from 'rxjs/operators';
import { ProfileService } from '@merit/common/services/profile.service';
import { MeritAchivementClient } from '@merit/common/achievements-client/api';
import {
  GoalSlug,
  IFullGoal,
  IFullProgress, IFullTask,
  IGoal, IGoalSettings,
  IProgress,
  ITask,
  ITaskProgress,
  TaskSlug, ProgressStatus
} from '@merit/common/models/goals';

const GoalData : { [goalSlug: string]: Partial<IFullGoal> } = {
  [GoalSlug.Creator]: {
    route: 'unlock',
    title: 'Wallet unlock',
    linkTitle: 'Unlock',
  },
  [GoalSlug.FastStarter]: {
    route: '',
    title: '',
    linkTitle: ''
  }
};

const DEFAULT_PROGRESS: IProgress = {
  tasks: [
    {
      slug: TaskSlug.CreateWallet,
      status: ProgressStatus.Complete
    },
    {
      slug: TaskSlug.UnlockWallet,
      status: ProgressStatus.Incomplete
    }
  ]
};

@Injectable()
export class GoalsService {
  private token: string;
  private client: MeritAchivementClient;
  private selectedWallet: DisplayWallet;

  goalsByTask: { [taskSlug: string]: GoalSlug; };
  goals: IGoal[];

  tasks: ITask[];
  tasksMap: { [taskSlug: string]: ITask; };

  progress: IFullProgress;

  statusByTask: { [taskSlug: string]: ProgressStatus } = {};

  constructor(private profileService: ProfileService,
              private store: Store<IRootAppState>) {
    this.store.select(selectPrimaryWallet)
      .subscribe(async (primaryWalletId: string) => {
        this.token = undefined;

        if (primaryWalletId) {
          await this.getToken(primaryWalletId);

          const wallets = await getLatestValue(this.store.select(selectWallets), wallets => wallets.length > 0);
          this.selectedWallet = wallets.find(wallet => wallet.id == primaryWalletId);

          this.store.dispatch(new RefreshGoalsProgressAction());
          this.store.dispatch(new RefreshGoalSettingsAction());

          if (!this.goals) {
            this.loadGoals();
          }
        }
      });
  }

  async getToken(primaryWalletId: string) {
    if (this.token) {
      return this.token;
    }

    const profile = await this.getProfile(primaryWalletId);
    this.setClient(profile);
    const { token } = await this.client.login();

    this.token = token;
    this.client.setToken(token);

    return token;
  }

  async getProgress(): Promise<IFullProgress> {
    let progress;

    try {
      progress = await this.client.getData('/progress/');
    } catch (err) {
      console.log('Error getting progress: ', err);
    }

    if (!progress) {
      progress = DEFAULT_PROGRESS;

      if (this.selectedWallet && this.selectedWallet.confirmed) {
        await this.setTaskStatus(TaskSlug.CreateWallet, ProgressStatus.Complete);
        await this.setTaskStatus(TaskSlug.UnlockWallet, ProgressStatus.Complete);
        return this.getProgress();
      }
    }

    return this.getFullProgress(progress);
  }

  getFullProgress(progress: IProgress): IFullProgress {
    const goalsMap: { [goalSlug: string]: IFullTask[]; } = {};

    this.statusByTask = {};

    for (let task in TaskSlug) {
      if (!progress.tasks.find(t => t.slug === TaskSlug[task])) {
        progress.tasks.push({
          slug: TaskSlug[task] as TaskSlug,
          status: ProgressStatus.Incomplete
        });
      }
    }

    progress.tasks.forEach((task: ITaskProgress) => {
      const goalSlug: GoalSlug = this.getGoalForTask(task.slug);

      this.statusByTask[task.slug] = task.status;

      if (!goalsMap[goalSlug]) {
        goalsMap[goalSlug] = [];
      }

      goalsMap[goalSlug].push(this.getFullTask(task));
    });

    const goals: IFullGoal[] = [];

    for (let slug in goalsMap) {
      const goal: IFullGoal = {
        ...this.getGoal(slug as GoalSlug),
        tasks: goalsMap[slug],
        status: ProgressStatus.Complete
      };

      const incomplete: boolean = goal.tasks.some(task => task.status !== ProgressStatus.Complete);

      if (incomplete) {
        goal.status = ProgressStatus.Incomplete;
      }

      goals.push(goal);
    }

    return this.progress =  {
      ...progress,
      goals
    };
  }

  async setTaskStatus(taskSlug: TaskSlug, status: ProgressStatus) {
    return this.client.setData('/progress/task/', {
      slug: taskSlug,
      status
    });
  }

  getTaskStatus(taskSlug: TaskSlug): ProgressStatus {
    return this.statusByTask[taskSlug];
  }

  getFullTask(taskProgress: ITaskProgress): IFullTask {
    return { ...this.tasksMap[taskProgress.slug], ...taskProgress };
  }

  getGoal(goalSlug: GoalSlug): IFullGoal {
    const goal: IGoal = this.goals.find(goal => goal.slug == goalSlug);

    if (goal) {
      return {
        ...goal,
        ...GoalData[goalSlug],
        tasks: [],
        status: ProgressStatus.Complete
      } as IFullGoal;
    }
  }

  getTask(taskSlug: TaskSlug): ITask {
    return this.tasksMap[taskSlug];
  }

  getSettings(): Promise<IGoalSettings> {
    return this.client.getData('/settings/');
  }

  async setSettings(settings: IGoalSettings) {
    await this.client.setData('/settings/', settings);
    return settings;
  }

  async loadGoals() {
    this.goals = await this.client.getData('/goals/');

    // Update GoalsByTask
    this.goalsByTask = {};
    this.tasksMap = {};

    if (!this.goals || !this.goals.length) {
      return;
    }

    this.goals.forEach((goal: IGoal) => {
      goal.tasks.forEach((task: ITask) => {
        this.goalsByTask[task.slug] = goal.slug;
        this.tasksMap[task.slug] = task;
      });
    });
  }

  getGoalForTask(taskSlug: TaskSlug): GoalSlug {
    return this.goalsByTask[taskSlug];
  }

  getTasksForGoal(goalSlug: GoalSlug): ITask[] {
    const goal = this.goals.find(goal => goal.slug == goalSlug);

    if (goal) {
      return goal.tasks;
    }
  }

  private setClient(profile: any) {
    this.client = MeritAchivementClient.fromObj(profile);
  }

  private async getProfile(primaryWallet: string) {
    const profile = await this.profileService.loadProfile();
    const loginProfile = {
      wallets: [],
      credentials: []
    };

    const wallets = await this.profileService.getWallets();

    if (wallets && wallets.length) {
      const wallet = wallets.find(wallet => wallet.id == primaryWallet);

      if (wallet) {
        loginProfile.credentials.push(wallet.credentials);
        return loginProfile;
      }
    }

    return profile;
  }

}
