import { Achievement, Achievements } from '@merit/common/models/achievement';
import { Action } from '@ngrx/store';

const DEFAULT_STATE: IAchievementsState = {
  achievements: [],
  token: '',
  settings: {
    id: '',
    userId: '',
    isSetupTrackerEnabled: true,
    isWelcomeDialogEnabled: false,
  },
};

export interface IAchievementsState {
  achievements: Achievement[];
  token: string;
  settings: {
    id: string;
    userId: string;
    isSetupTrackerEnabled: boolean;
    isWelcomeDialogEnabled: boolean;
  };
}

export function AchievementsReducer(state: IAchievementsState = DEFAULT_STATE, action: AchievementsAction) {
  switch (action.type) {
    case AchievementsActionType.LoadAchievements:
      return {
        ...state,
        achievements: [...action.achievements],
      };
    case AchievementsActionType.SetAuthorizeToken:
      return {
        ...state,
        token: action.token,
      };
    case AchievementsActionType.SetAchievementsSettings:
      return {
        ...state,
        settings: action.settings,
      };
    case AchievementsActionType.CompleteAchivement:
      let task: any = state.achievements.filter((item: any) => item.id === action.completeTask.id)[0],
        index = state.achievements.indexOf(task),
        condition: any = task.conditions.filter((item: any) => item.slug === action.completeTask.step)[0],
        cIndex = state.achievements.indexOf(condition);
      condition.status = 2;
      task.conditions[cIndex] = condition;

      if (task.conditions.length === condition.slug) {
        task.status = 2;
      }

      state.achievements[index] = task;

      return {
        ...state,
        achievements: state.achievements,
      };
    default:
      return state;
  }
}

export enum AchievementsActionType {
  LoadAchievements = '[Achievements] Load Achievements',
  SetAuthorizeToken = '[Achievements] Set authorize token',
  SetAchievementsSettings = '[Achievements] Set achievements aettings',
  CompleteAchivement = '[Achievements] Complete achivement',
}

export class SetAuthorizeToken implements Action {
  type = AchievementsActionType.SetAuthorizeToken;

  constructor(public token: string) {}
}

export class SetAchievementsSettings implements Action {
  type = AchievementsActionType.SetAchievementsSettings;

  constructor(public settings: {}) {}
}

export class CompleteAchievement implements Action {
  type = AchievementsActionType.CompleteAchivement;

  constructor(public completeTask: any) {}
}

export class SetAchievementsAction implements Action {
  type = AchievementsActionType.LoadAchievements;

  constructor(public achievements: Achievement[]) {}
}

export type AchievementsAction = SetAchievementsAction &
  SetAuthorizeToken &
  SetAchievementsSettings &
  CompleteAchievement;
