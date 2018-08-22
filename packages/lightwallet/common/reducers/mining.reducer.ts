import { Action, createFeatureSelector, createSelector } from '@ngrx/store';
import { IGPUInfo } from '../../desktop/src/app/core/mining/gpu-info.model';

export interface IMiningState {
  connected: boolean;
  mining: boolean;
  stopping: boolean;
  stats: any;
  miningDatasets: IMiningDatasets;
  gpuInfo: IGPUInfo[];
}

export type IMiningDatasets = {
  gpuTemp: IMiningDataset[];
  gpuUtil: IMiningDataset[];
  graphs: IMiningDataset[];
  cyclesAndShares: IMiningDataset[];
};

export interface IMiningStat {
  name: Date;
  value: number | number[];
}

export interface IMiningDataset {
  name: string;
  series: IMiningStat[];
}

const DEFAULT_STATE: IMiningState = {
  connected: false,
  mining: false,
  stopping: false,
  stats: null,
  miningDatasets: {
    gpuTemp: [],
    gpuUtil: [],
    graphs: [],
    cyclesAndShares: [],
  },
  gpuInfo: [],
};

export enum MiningActions {
  StartMining = '[Mining] Start mining',
  StopMining = '[Mining] Stop mining',
  UpdateMiningDatasets = '[Mining] Update datasets',
  UpdateStats = '[Mining] Update stats',
  UpdateConnection = '[Mining] Update connection',
  SetMiningStopped = '[Mining] Set mining to stopped',
  UpdateGPUInfo = '[Mining] Update GPU info',
}

export class StartMiningAction implements Action {
  readonly type = MiningActions.StartMining;
}

export class StopMiningAction implements Action {
  readonly type = MiningActions.StopMining;
}

export class UpdateMiningDatasetsAction implements Action {
  readonly type = MiningActions.UpdateMiningDatasets;

  constructor(public datasets: IMiningDatasets) {}
}

export class UpdateMiningStatsAction implements Action {
  readonly type = MiningActions.UpdateStats;

  constructor(public stats: any) {}
}

export class UpdateMiningConnectionAction implements Action {
  readonly type = MiningActions.UpdateConnection;

  constructor(public connected: boolean) {}
}

export class SetMiningStoppedAction implements Action {
  readonly type = MiningActions.SetMiningStopped;
}

export class UpdateGPUInfoAction implements Action {
  readonly type = MiningActions.UpdateGPUInfo;

  constructor(public gpuInfo: IGPUInfo[]) {}
}

export type MiningAction = StartMiningAction & StopMiningAction & UpdateMiningDatasetsAction & UpdateMiningStatsAction & UpdateMiningConnectionAction & UpdateGPUInfoAction;

export function miningReducer(state: IMiningState = DEFAULT_STATE, action: MiningAction): IMiningState {
  switch (action.type) {
    case MiningActions.StartMining:
      return {
        ...state,
        mining: true
      };

    case MiningActions.StopMining:
      return {
        ...state,
        mining: false,
        stopping: true
      };

    case MiningActions.UpdateMiningDatasets:
      return {
        ...state,
        miningDatasets: {
          gpuUtil: [...action.datasets.gpuUtil],
          gpuTemp: [...action.datasets.gpuTemp],
          cyclesAndShares: [...action.datasets.cyclesAndShares],
          graphs: [...action.datasets.graphs],
        }
      };

    case MiningActions.UpdateStats:
      return {
        ...state,
        stats: action.stats,
      };

    case MiningActions.UpdateConnection:
      if (state.connected !== action.connected) {
        return {
          ...state,
          connected: action.connected,
        };
      }
      return state;

    case MiningActions.SetMiningStopped:
      return {
        ...state,
        stopping: false,
        mining: false,
      };

    case MiningActions.UpdateGPUInfo:
      return {
        ...state,
        gpuInfo: action.gpuInfo,
      };

    default:
      return state;
  }
}

export const selectMiningState = createFeatureSelector<IMiningState>('mining');
export const selectIsMining = createSelector(selectMiningState, state => state.mining);
export const selectIsStopping = createSelector(selectMiningState, state => state.stopping);
export const selectIsConnected = createSelector(selectMiningState, state => state.connected);
export const selectMiningDatasets = createSelector(selectMiningState, state => state.miningDatasets);
export const selectMiningStats = createSelector(selectMiningState, state => state.stats);
export const selectGPUInfo = createSelector(selectMiningState, state => state.gpuInfo);
export const selectGPUTempDatasets = createSelector(selectMiningDatasets, data => data.gpuTemp);
export const selectGPUUtilDatasets = createSelector(selectMiningDatasets, data => data.gpuUtil);
export const selectGraphDatasets = createSelector(selectMiningDatasets, data => data.graphs);
export const selectCycleAndShareDatasets = createSelector(selectMiningDatasets, data => data.cyclesAndShares);
