import { Action, createFeatureSelector, createSelector } from "@ngrx/store";

export interface IGPUStat {
  t: Date;
  y: number;
}

export interface IGPUStatDataset {
  data: IGPUStat[],
  label: string,
  borderColor: string
  borderWidth: number,
  pointRadius: number
}

export interface IGpuStatsState {
  stats: {
    [slug : string] : IGPUStatDataset[]
  }
}

const DEFAULT_STATE: IGpuStatsState = { stats: {} };


export enum GpuStatsActionType {
  addStat = '[GPU stats] Add new stat(data)',
  addDatasets = '[GPU stats] Add datasets',
}

export class GpuAddStatAction implements Action {
  type = GpuStatsActionType.addStat;

  constructor(public slug: string, public data: IGPUStat[], public limit: number) {}
}

export class GpuAddDatasetsAction implements Action {
  type = GpuStatsActionType.addDatasets;

  constructor(public slug: string, public datasets: IGPUStatDataset[]) {}
}

export type GpuStatsAction =
  GpuAddStatAction
  & GpuAddDatasetsAction

export function gpuStatsReducer(state: IGpuStatsState = DEFAULT_STATE, action: GpuStatsAction){
  switch (action.type) {
    case GpuStatsActionType.addDatasets: {
      let res = state;

      res.stats[action.slug] = action.datasets;

      return res;
    }

    case GpuStatsActionType.addStat: {
      let res = state;

      // Check if stats are empty before pushing
      if(!(action.slug in res.stats)){
        res.stats[action.slug] = [];
        res.stats[action.slug].length = action.data.length;
      }

      for (let i = 0; i < action.data.length; i++){
        res.stats[action.slug][i].data.push(action.data[i]);

        if(res.stats[action.slug][i].data.length > action.limit)
          res.stats[action.slug][i].data.shift();
      }

      return res;
    }

    default:
      return state
  }
}

export const selectGpuStatsState = createFeatureSelector<IGpuStatsState>('stats');
export const selectGpuStatsBySlug = (slug: any) => createSelector(selectGpuStatsState, data => data.stats[slug]);
