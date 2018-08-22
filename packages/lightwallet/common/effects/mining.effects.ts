import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import {
  IMiningDataset,
  MiningActions,
  selectIsMining,
  selectMiningDatasets,
  SetMiningStoppedAction,
  UpdateGPUInfoAction,
  UpdateMiningConnectionAction,
  UpdateMiningStatsAction
} from '@merit/common/reducers/mining.reducer';
import { delay, expand, map, switchMap, take, takeWhile, tap } from 'rxjs/operators';
import { IRootAppState } from '@merit/common/reducers';
import { ElectronService } from '../../desktop/src/services/electron.service';
import { pick } from 'lodash';
import { IGPUInfo } from '../../desktop/src/app/core/mining/gpu-info.model';
import { of } from 'rxjs/observable/of';

const borderColors: string[] = ['#00b0dd', '#2eb483'];

const baseDataset: IMiningDataset = {
  borderWidth: 2,
  pointRadius: 0
} as IMiningDataset;

function updateGpuDatasets(gpuInfo: IGPUInfo[], gpuTemp: IMiningDataset[], gpuUtil: IMiningDataset[]) {
  if (!gpuTemp.length) {
    gpuInfo.forEach((data: IGPUInfo, i: number) => {
      gpuTemp.push({
        ...baseDataset,
        data: [],
        label: data.title,
        borderColor: '#0046ff'
      });

      gpuUtil.push(
        {
          ...baseDataset,
          data: [],
          label: data.title + ' cores',
          borderColor: '#0046ff'
        },
        {
          ...baseDataset,
          data: [],
          label: data.title + ' memory',
          borderColor: '#2eb483'
        }
      );
    });
  }

  const t: Date = new Date();

  gpuInfo.forEach((data: IGPUInfo, i: number) => {
    gpuTemp[i].data.push({
      t,
      y: data.temperature
    });

    gpuUtil[i * 2].data.push({
      t,
      y: data.gpu_util
    });

    gpuUtil[i * 2 + 1].data.push({
      t,
      y: data.memory_util
    });
  });

  // keep only most recent 100 in memory
  const cutOff = gpuTemp[0].data.length - 100;
  if (cutOff > 0) {
    gpuTemp.forEach(ds => ds.data.splice(0, cutOff));
    gpuUtil.forEach(ds => ds.data.splice(0, cutOff));
  }
}

function updateMiningStats(stats: any, cyclesAndShares: IMiningDataset[], graphs: IMiningDataset[]) {
  const t: Date = new Date();

  if (!cyclesAndShares.length) {
    cyclesAndShares.push(
      {
        ...baseDataset,
        data: [],
        borderColor: borderColors[0],
        label: 'Cycles'
      },
      {
        ...baseDataset,
        data: [],
        borderColor: borderColors[1],
        label: 'Shares'
      }
    );

    graphs.push({
      ...baseDataset,
      data: [],
      borderColor: '#2eb483',
      label: 'Graphs'
    });
  }

  cyclesAndShares[0].data.push({
    t,
    y: stats.total.cycles + stats.current.cycles
  });

  cyclesAndShares[1].data.push({
    t,
    y: stats.total.shares + stats.current.shares
  });

  graphs[0].data.push({
    t,
    y: stats.total.attempts + stats.current.attempts
  });

  // keep only most recent 200 in memory
  const cutOff = graphs[0].data.length - 200;
  if (cutOff > 0) {
    cyclesAndShares[0].data.splice(0, cutOff);
    cyclesAndShares[1].data.splice(0, cutOff);
    graphs[0].data.splice(0, cutOff);
  }
}

@Injectable()
export class MiningEffects {
  _isMining: boolean = true;
  _isStopping: boolean = true;

  @Effect({dispatch: false})
  onStart$: Observable<any> = this.actions$.pipe(
    ofType(MiningActions.StartMining),
    switchMap(() =>
      of(null)
        .pipe(
          expand(() =>
            this.store$.select(selectMiningDatasets)
              .pipe(
                take(1),
                tap(({gpuTemp, gpuUtil, cyclesAndShares, graphs}) => {
                  const connected = ElectronService.isConnectedToPool();
                  this.store$.dispatch(new UpdateMiningConnectionAction(connected));

                  if (!connected) {
                    return;
                  }

                  const stats = ElectronService.getMiningStats();
                  const gpuInfo = ElectronService.GPUDevicesInfo()
                    .map(info => pick(info, 'id', 'title', 'total_memory', 'temperature', 'gpu_util',
                      'memory_util', 'fan_speed'));

                  // updateGpuDatasets(gpuInfo, gpuTemp, gpuUtil);
                  // updateMiningStats(stats, cyclesAndShares, graphs);

                  // this.store$.dispatch(new UpdateMiningDatasetsAction({gpuTemp, gpuUtil, cyclesAndShares, graphs}));
                  this.store$.dispatch(new UpdateMiningStatsAction(stats));
                  this.store$.dispatch(new UpdateGPUInfoAction(gpuInfo))

                }),
                switchMap(() =>
                  this.store$.select(selectIsMining)
                    .pipe(
                      take(1)
                    )
                ),
                tap(isMining => {
                  if (this._isMining = isMining) {
                    this._isStopping = true;
                  }
                }),
                delay(5000)
              )
          ),
          takeWhile(() => this._isMining)
        )
    )
  );

  @Effect()
  onStop$: Observable<SetMiningStoppedAction> = this.actions$.pipe(
    ofType(MiningActions.StopMining),
    tap(() => {
      console.log('Stopping the miner');
      ElectronService.stopMining()
    }),
    switchMap(() =>
      of(null)
        .pipe(
          expand(() =>
            of(this._isStopping = ElectronService.isStopping())
              .pipe(
                delay(1000)
              )
          ),
          takeWhile(() => this._isStopping)
        )
    ),
    map(() => new SetMiningStoppedAction())
  );

  constructor(private actions$: Actions,
              private store$: Store<IRootAppState>) {
  }
}
