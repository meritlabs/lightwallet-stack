import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
import { MeritAchivementClient } from '@merit/common/achievements-client/api';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import {
  GoalSlug,
  IFullGoal,
  IFullProgress,
  IFullTask,
  IGoal,
  IGoalSettings,
  IProgress,
  ITask,
  ITaskProgress,
  ProgressStatus,
  TaskSlug,
} from '@merit/common/models/goals';
import { IRootAppState } from '@merit/common/reducers';
import {
  RefreshGoalSettingsAction,
  RefreshGoalsProgressAction,
  StatusByTask,
} from '@merit/common/reducers/goals.reducer';
import { selectPrimaryWallet } from '@merit/common/reducers/interface-preferences.reducer';
import { ProfileService } from '@merit/common/services/profile.service';
import { Store } from '@ngrx/store';

const GoalData: { [goalSlug: string]: Partial<IFullGoal> } = {
  [GoalSlug.Creator]: {
    route: 'unlock',
    title: 'Wallet unlock',
    linkTitle: 'Unlock',
  },
  [GoalSlug.FastStarter]: {
    route: '',
    title: '',
    linkTitle: '',
  },
};

const DEFAULT_PROGRESS: IProgress = {
  tasks: [
    {
      slug: TaskSlug.CreateWallet,
      status: ProgressStatus.Complete,
    },
    {
      slug: TaskSlug.UnlockWallet,
      status: ProgressStatus.Incomplete,
    },
  ],
};

const DEFAULT_SETTINGS: IGoalSettings = {
  isSetupTrackerEnabled: true,
  isWelcomeDialogEnabled: false,
};

@Injectable()
export class GoalsService {
  private token: string;
  private client: MeritAchivementClient;
  private selectedWallet: DisplayWallet;

  goalsByTask: { [taskSlug: string]: GoalSlug } = {};
  goals: IGoal[] = [];

  tasks: ITask[] = [];
  tasksMap: { [taskSlug: string]: ITask } = {};

  progress: IFullProgress;

  statusByTask: { [taskSlug: string]: ProgressStatus } = {};

  constructor(private profileService: ProfileService, private store: Store<IRootAppState>, private http: HttpClient) {
    this.loadGoals();

    this.store.select(selectPrimaryWallet).subscribe(async (primaryWallet: DisplayWallet) => {
      this.token = undefined;
      this.selectedWallet = primaryWallet;

      if (primaryWallet && primaryWallet.confirmed) {
        await this.getToken(primaryWallet);
      }

      this.store.dispatch(new RefreshGoalsProgressAction());
      this.store.dispatch(new RefreshGoalSettingsAction());
    });
  }

  async getToken(primaryWallet: DisplayWallet) {
    if (this.token) {
      return this.token;
    }

    try {
      const profile = await this.getProfile(primaryWallet);
      this.setClient(profile);
      const { token } = await this.client.login();

      this.token = token;
      this.client.setToken(token);

      return token;
    } catch (err) {
      console.error('Error getting token for Goals API', err);
    }
  }

  async getProgress(): Promise<IFullProgress> {
    let progress;

    try {
      progress = await this.client.getData('/progress/');
    } catch (err) {
      console.error('Error getting progress: ', err);
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
    const goalsMap: { [goalSlug: string]: IFullTask[] } = {};

    const statusByTask: StatusByTask = {};

    for (let task in TaskSlug) {
      if (!progress.tasks.find(t => t.slug === TaskSlug[task])) {
        progress.tasks.push({
          slug: TaskSlug[task] as TaskSlug,
          status: ProgressStatus.Incomplete,
        });
      }
    }

    progress.tasks.forEach((task: ITaskProgress) => {
      const goalSlug: GoalSlug = this.getGoalForTask(task.slug);

      statusByTask[task.slug] = task.status;

      if (!goalsMap[goalSlug]) {
        goalsMap[goalSlug] = [];
      }

      goalsMap[goalSlug].push({ ...this.tasksMap[task.slug], ...task });
    });

    const goals: IFullGoal[] = [];

    for (let slug in goalsMap) {
      const goal: IFullGoal = {
        ...this.getGoal(slug as GoalSlug),
        tasks: goalsMap[slug],
        status: ProgressStatus.Complete,
      };

      const incomplete: boolean = goal.tasks.some(task => task.status !== ProgressStatus.Complete);

      if (incomplete) {
        goal.status = ProgressStatus.Incomplete;
      }

      goals.push(goal);
    }

    this.statusByTask = statusByTask;

    return (this.progress = {
      ...progress,
      goals,
    });
  }

  async setTaskStatus(taskSlug: TaskSlug, status: ProgressStatus) {
    return this.client.setData('/progress/task/', {
      slug: taskSlug,
      status,
    });
  }

  getTaskStatus(taskSlug: TaskSlug): ProgressStatus {
    return this.statusByTask[taskSlug];
  }

  getFullTask(taskSlug: TaskSlug): IFullTask {
    return { ...this.tasksMap[taskSlug], status: this.getTaskStatus(taskSlug) };
  }

  getGoal(goalSlug: GoalSlug): IFullGoal {
    const goal: IGoal = this.goals.find(goal => goal.slug == goalSlug);

    if (goal) {
      return {
        ...goal,
        ...GoalData[goalSlug],
        tasks: [],
        status: ProgressStatus.Complete,
      } as IFullGoal;
    }
  }

  getTask(taskSlug: TaskSlug): ITask {
    return this.tasksMap[taskSlug];
  }

  async getSettings(): Promise<IGoalSettings> {
    try {
      const settings: IGoalSettings = await this.client.getData('/settings/');
      return settings;
    } catch (err) {
      console.error('Unable to get settings', err);
    }

    return DEFAULT_SETTINGS;
  }

  async setSettings(settings: IGoalSettings) {
    await this.client.setData('/settings/', settings);
    return settings;
  }

  async loadGoals() {
    try {
      this.goals = (await this.http.get(ENV.achievementApi + '/goals/').toPromise()) as IGoal[];

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
    } catch (err) {
      console.error('Error fetching goals', err);
    }
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

  private async getProfile(wallet: DisplayWallet) {
    const profile = await this.profileService.loadProfile();
    const loginProfile = {
      wallets: [],
      credentials: [],
    };

    if (wallet) {
      loginProfile.credentials.push(wallet.credentials);
      return loginProfile;
    }

    return profile;
  }
}
