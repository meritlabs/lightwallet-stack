import { Injectable } from '@angular/core';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';
import { selectPrimaryWallet } from '@merit/common/reducers/interface-preferences.reducer';
import { take } from 'rxjs/operators';
import { ProfileService } from '@merit/common/services/profile.service';
import { MeritAchivementClient } from '@merit/common/achievements-client/api';
import {
  GoalSlug,
  IFullGoal,
  IFullProgress, IFullTask,
  IGoal,
  IProgress,
  ITask,
  ITaskProgress,
  TaskSlug, TaskStatus
} from '@merit/common/models/goals';

@Injectable()
export class GoalsService {
  private token: string;
  private client: MeritAchivementClient;

  goalsByTask: { [taskSlug: string]: GoalSlug; };
  goals: IGoal[];

  tasks: ITask[];
  tasksMap: { [taskSlug: string]: ITask; };

  progress: IFullProgress;

  statusByTask: { [taskSlug: string]: TaskStatus };

  constructor(private profileService: ProfileService,
              private store: Store<IRootAppState>) {}

  async getToken() {
    if (this.token) {
      return this.token;
    }

    const profile = await this.getProfile();
    this.setClient(profile);
    const { token } = await this.client.login();

    this.token = token;
    this.client.setToken(token);

    return token;
  }

  refreshToken() {
    this.token = undefined;
    return this.getToken();
  }

  async getProgress(): Promise<IFullProgress> {
    const progress = await this.client.getData('/progress');
    return this.getFullProgress(progress);
  }

  getFullProgress(progress: IProgress): IFullProgress {
    const goalsMap: { [goalSlug: string]: IFullTask[]; } = {};

    progress.tasks.forEach((task: ITaskProgress) => {
      const goalSlug: GoalSlug = this.getGoalForTask(task.slug);

      this.statusByTask[task.slug] = task.status;

      if (!goalsMap[goalSlug]) {
        goalsMap[goalSlug] = [];
      }

      goalsMap[goalSlug].push(this.getFullTask(task));
    });

    const goals = [];
    for (let slug in goalsMap) {
      goals.push(goalsMap[slug]);
    }

    return this.progress =  {
      ...progress,
      goals
    };
  }

  getTaskStatus(taskSlug: TaskSlug): TaskStatus {
    return this.statusByTask[taskSlug];
  }

  getFullTask(taskProgress: ITaskProgress): IFullTask {
    return { ...this.tasksMap[taskProgress.slug], ...taskProgress };
  }

  async loadGoals() {
    this.goals = await this.client.getData('/goals');

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

  private async getProfile() {
    const profile = await this.profileService.loadProfile();
    const loginProfile = {
      wallets: [],
      credentials: []
    };

    const wallets = await this.profileService.getWallets();

    if (wallets && wallets.length) {
      const primaryWallet = await this.store.select(selectPrimaryWallet).pipe(take(1)).toPromise();
      const wallet = wallets.find(wallet => wallet.id == primaryWallet);

      if (wallet) {
        loginProfile.credentials.push(wallet.credentials);
        return loginProfile;
      }
    }

    return profile;
  }

}
