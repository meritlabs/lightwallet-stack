import { AddressService } from '@merit/common/services/address.service';
import { Component, ViewEncapsulation } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { ElectronService } from '@merit/desktop/services/electron.service';
import { Observable } from 'rxjs/Observable';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { Store } from '@ngrx/store';
import { WalletService } from '@merit/common/services/wallet.service';
import { selectWallets } from '@merit/common/reducers/wallets.reducer';
import { IRootAppState } from '@merit/common/reducers';
import { IGPUInfo } from './gpu-info.model';
import { pick } from 'lodash';
import { IPool } from '@merit/desktop/app/core/components/select-pool/select-pool.component';
import { getLatestValue } from '@merit/common/utils/observables';
import { map } from 'rxjs/operators';
import {
  IMiningDataset,
  selectCycleAndShareDatasets,
  selectGPUInfo,
  selectGPUTempDatasets,
  selectGPUUtilDatasets,
  selectGraphDatasets,
  selectIsConnected,
  selectIsMining,
  selectIsStopping,
  selectMiningDatasets,
  selectMiningStats,
  StartMiningAction,
  StopMiningAction
} from '@merit/common/reducers/mining.reducer';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Component({
  selector: 'view-mining',
  templateUrl: './mining.view.html',
  styleUrls: ['./mining.view.sass'],
  encapsulation: ViewEncapsulation.None
})
export class MiningView {
  wallets$: Observable<DisplayWallet[]> = this.store.select(selectWallets);
  selectedWallet: DisplayWallet;

  address: string;
  alias: string;
  workers: number = 1;
  threadsPerWorker: number = 1;
  minCores: number = 0;
  maxCores: number = ElectronService.numberOfCores();
  minGPUs: number = 0;
  maxGPUs: number = ElectronService.numberOfGPUDevices();
  cores: number;
  gpusInfo: IGPUInfo[];
  activeGpuDevices: number[];
  miningSettings: any;
  pools: IPool[] = [];
  selectedPool: IPool;
  mining: boolean = false;
  error: string;

  connected$: Observable<boolean> = this.store.select(selectIsConnected);
  mining$: Observable<boolean> = this.store.select(selectIsMining);
  stopping$: Observable<boolean> = this.store.select(selectIsStopping);

  datasets$ = this.store.select(selectMiningDatasets);
  gpuTempDatasets$: Observable<IMiningDataset[]> = this.store.select(selectGPUTempDatasets);
  gpuUtilDatasets$: Observable<IMiningDataset[]> = this.store.select(selectGPUUtilDatasets);
  cycleAndShareDatasets$: Observable<IMiningDataset[]> = this.store.select(selectCycleAndShareDatasets);
  graphDatasets$: Observable<IMiningDataset[]> = this.store.select(selectGraphDatasets);

  stats$: Observable<any> = this.store.select(selectMiningStats);
  gpuInfo$: Observable<IGPUInfo[]> = this.store.select(selectGPUInfo)
    .pipe(
      map((gpuInfo: IGPUInfo[]) =>
        gpuInfo.filter(info => info.id in this.activeGpuDevices)
      )
    );

  miningLabel$: Observable<string> = combineLatest(this.mining$, this.stopping$)
    .pipe(
      map(([mining, stopping]) => stopping ? 'Stopping' : mining ? 'Stop' : 'Start')
    );


  constructor(
    private store: Store<IRootAppState>,
    private walletService: WalletService,
    private persistenceService: PersistenceService2,
    private addressService: AddressService
  ) {
  }

  async ngOnInit() {
    try {
      const wallets = await getLatestValue(this.wallets$, w => w.length > 0);

      this.miningSettings = await this.persistenceService.getMinerSettings();
      this.pools = await this.persistenceService.getAvailablePools();

      if (this.miningSettings.selectedWallet) {
        this.selectWallet(this.miningSettings.selectedWallet, false);
      } else {
        this.selectWallet(wallets[0], false);
      }

      if (this.miningSettings.cores || this.miningSettings.cores == 0) {
        this.cores = this.miningSettings.cores;
      } else {
        this.cores = Math.max(this.minCores, this.maxCores / 2);
      }

      if (this.miningSettings.gpusInfo) {
        this.gpusInfo = this.miningSettings.gpusInfo;
      } else {
        this.gpusInfo = MiningView.getGPUInfo();

        this.gpusInfo.forEach((info: IGPUInfo) => {
          info.value = false;
          info.free_memory = this.freeMemoryOnDevice(info.id);
        });
      }

      if (this.miningSettings.activeGpuDevices)
        this.activeGpuDevices = this.miningSettings.activeGpuDevices;
      else
        this.activeGpuDevices = [];

      if (this.miningSettings.selectedPool)
        this.selectedPool = this.miningSettings.selectedPool;
      else
        this.selectedPool = this.pools[0];

      this.saveSettings();
      ElectronService.setAgent();

      combineLatest(this.mining$, this.connected$)
        .subscribe(([mining, connected]) => {
          if (mining && !connected) {
            this.error = 'Disconnected from pool. Reconnecting...';
          } else {
            this.error = null;
          }
        });
    } catch (err) {
      if (err.text) console.log('Could not initialize: ', err.text);
    }
  }

  chooseGPU(index: number): void {
    this.gpusInfo[index].value = !this.gpusInfo[index].value;

    for (let i = 0; i < this.gpusInfo.length; i++) {
      // push
      const deviceIndex: number = this.activeGpuDevices.indexOf(this.gpusInfo[i].id);

      if (this.gpusInfo[i].value && deviceIndex == -1) {
        this.activeGpuDevices.push(this.gpusInfo[i].id);
      }

      // remove
      if (!this.gpusInfo[i].value && deviceIndex != -1) {
        this.activeGpuDevices.splice(deviceIndex, 1);
      }
    }

    this.saveSettings();
  }

  async selectWallet(wallet: DisplayWallet, save: boolean) {
    if (!wallet) return;

    this.selectedWallet = wallet;
    this.address = this.selectedWallet.client.getRootAddress().toString();
    const {alias} = await this.addressService.getAddressInfo(this.address);
    this.alias = alias;
    if (save) {
      this.saveSettings();
    }
  }

  selectPool(pool: IPool) {
    if (!pool) return;
    this.error = null;
    this.selectedPool = pool;
    this.saveSettings();
  }

  isMining() {
    return ElectronService.isMining();
  }

  isStopping() {
    return ElectronService.isStopping();
  }

  computeUtilization() {
    if (this.cores % 2 == 0) {
      this.workers = this.cores / 2;
      this.threadsPerWorker = 2;
    } else {
      this.workers = this.cores;
      this.threadsPerWorker = 1;
    }
  }

  setCores(e: any) {
    this.cores = parseInt(e.target.value);
    this.saveSettings();
  }

  saveSettings() {
    this.miningSettings = {
      ...this.miningSettings,
      cores: this.cores,
      gpusInfo: this.gpusInfo,
      activeGpuDevices: this.activeGpuDevices,
      selectedPool: this.selectedPool
    };

    this.persistenceService.setMiningSettings(this.miningSettings);
  }

  stopMining() {
    this.error = null;
    if (!this.isStopping()) {
      this.store.dispatch(new StopMiningAction());
    }
  }

  isConnected() {
    return ElectronService.isConnectedToPool();
  }

  freeMemoryOnDevice(device: number) {
    return ElectronService.getFreeMemoryOnDevice(device);
  }

  startMining() {
    this.error = null;
    this.computeUtilization();

    if ((this.threadsPerWorker * this.workers) == 0 && this.activeGpuDevices.length == 0)
      return;

    try {
      ElectronService.startMining(
        this.selectedPool.url,
        this.address,
        this.workers,
        this.threadsPerWorker,
        this.activeGpuDevices
      );

      this.store.dispatch(new StartMiningAction());
    } catch (e) {
      console.log(e);
      this.error = e.message;
      // this.error = "Error Connecting to the Selected Pool";
    }
  }

  toggleMining() {
    this.saveSettings();

    if (this.isMining()) {
      this.stopMining();
    } else {
      this.startMining();
    }
  }

  static getGPUInfo(): IGPUInfo[] {
    const rawInfo = ElectronService.GPUDevicesInfo();
    const gpuInfos: IGPUInfo[] = [];
    for (let info of rawInfo)
      gpuInfos.push(pick(info, 'id', 'title', 'total_memory', 'temperature', 'gpu_util', 'memory_util', 'fan_speed'));

    return gpuInfos;
  }
}
