import { AddressService } from '@merit/common/services/address.service';
import { Component, ViewEncapsulation } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { ElectronService } from '@merit/desktop/services/electron.service';
import { Observable } from 'rxjs/Observable';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { Store } from '@ngrx/store';
import { WalletService } from '@merit/common/services/wallet.service';

import { selectWallets, selectWalletsLoading } from '@merit/common/reducers/wallets.reducer';

import { IRootAppState } from '@merit/common/reducers';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'view-mining',
  templateUrl: './mining.view.html',
  styleUrls: ['./mining.view.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class MiningView {
  wallets$: Observable<DisplayWallet[]> = this.store.select(selectWallets);
  walletsLoading$: Observable<boolean> = this.store.select(selectWalletsLoading);
  selectedWallet: DisplayWallet;

  address: string;
  alias: string;
  workers: number = 1;
  threadsPerWorker: number = 1;
  miningLabel: string;
  updateTimer: any;
  statTimer: any;
  minCores: number = 0;
  maxCores: number;
  minGPUs: number = 0;
  maxGPUs: number;
  cores: number;
  gpus: number;
  gpus_info: any[];
  active_gpu_devices: number[] = [];
  miningSettings: any;
  pools: any[];
  selectedPool: any;
  mining: boolean = false;
  stats: any = {};
  error: string;

  constructor(
    private store: Store<IRootAppState>,
    private walletService: WalletService,
    private persistenceService: PersistenceService2,
    private addressService: AddressService,
  ) {
    this.maxCores = ElectronService.numberOfCores();
    this.maxGPUs = ElectronService.numberOfGPUDevices();
    this.gpus_info = ElectronService.GPUDevicesInfo();
    this.updateLabel();
    this.pools = [];
  }

  async ngOnInit() {
    try {
      const wallets = await this.wallets$
        .pipe(
          filter(w => w.length > 0),
          take(1),
        )
        .toPromise();

      this.miningSettings = await this.persistenceService.getMinerSettings();

      if (this.miningSettings.selectedWallet) {
        this.selectWallet(this.miningSettings.selectedWallet, false);
      } else {
        this.selectWallet(wallets[0], false);
      }

      if (this.miningSettings.cores) {
        this.cores = this.miningSettings.cores;
      } else {
        this.cores = Math.max(this.minCores, this.maxCores / 2);
      }

      if (this.miningSettings.gpus) {
        this.gpus = this.miningSettings.gpus;
      } else {
        this.gpus = Math.max(this.minGPUs, this.maxGPUs / 2) | 0;
      }

      if (this.miningSettings.selectedPool) {
        this.pools = this.miningSettings.pools;
        this.selectedPool = this.miningSettings.selectedPool;
      } else {
        this.pools = [
          {
            name: 'Merit Pool',
            website: 'https://pool.merit.me',
            url: 'stratum+tcp://pool.merit.me:3333',
          },
          {
            name: 'Merit Pool2',
            website: 'https://pool2.merit.me',
            url: 'stratum+tcp://pool2.merit.me:3333',
          },
          {
            name: 'Merit Testnet Pool',
            website: 'https://testnet.merit.me',
            url: 'stratum+tcp://testnet.merit.me:3333',
          },
          {
            name: 'Parachute Pool',
            website: 'https://parachute.merit.me',
            url: 'stratum+tcp://parachute.merit.me:3333',
          },
          /*
           * TODO : Add support for custom pools
          {
            name: 'Custom',
            url: ''
          },
           */
        ];
        this.selectedPool = this.pools[0];
      }

      this.saveSettings();
      ElectronService.setAgent();
      this.updateStats();

      for (let info of this.gpus_info) info['value'] = false;
    } catch (err) {
      if (err.text) console.log('Could not initialize: ', err.text);
    }
  }

  chooseGPU(item, event): void {
    this.gpus_info[this.gpus_info.indexOf(item)].value = !this.gpus_info[this.gpus_info.indexOf(item)].value;

    for (let i = 0; i < this.gpus_info.length; i++) {
      // push
      let dev_index = this.active_gpu_devices.indexOf(this.gpus_info[i].id);
      if (this.gpus_info[i].value && dev_index == -1) {
        this.active_gpu_devices.push(this.gpus_info[i].id);
      }

      // remove
      if (!this.gpus_info[i].value && dev_index != -1) {
        this.active_gpu_devices.splice(dev_index, 1);
      }
    }
  }

  async selectWallet(wallet: DisplayWallet, save: boolean) {
    if (!wallet) return;

    this.selectedWallet = wallet;
    this.address = this.selectedWallet.client.getRootAddress().toString();
    let info = await this.addressService.getAddressInfo(this.address);
    this.alias = info.alias;
    if (save) {
      this.saveSettings();
    }
  }

  selectPool(pool: any) {
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

  mineButtonLabel() {
    if (this.isMining()) {
      if (this.isStopping()) {
        return 'Stopping';
      } else {
        return 'Stop';
      }
    }
    return 'Start';
  }

  updateLabel() {
    this.miningLabel = this.mineButtonLabel();
    if (this.isStopping()) {
      this.updateTimer = setTimeout(this.updateLabel.bind(this), 250);
    }
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
    this.miningSettings.cores = this.cores;
    this.miningSettings.gpus = this.gpus;
    this.miningSettings.pools = this.pools;
    this.miningSettings.selectedPool = this.selectedPool;
    this.persistenceService.setMiningSettings(this.miningSettings);
  }

  stopMining() {
    this.error = null;
    if (!this.isStopping()) {
      console.log('stats', this.stats);
      ElectronService.stopMining();
      this.updateTimer = setTimeout(this.updateLabel.bind(this), 250);
      this.statTimer = setTimeout(this.updateStats.bind(this), 1000);
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

    if ((this.threadsPerWorker * this.workers) == 0 && this.active_gpu_devices.length == 0)
      return;

    try {
      ElectronService.startMining(
        this.selectedPool.url,
        this.address,
        this.workers,
        this.threadsPerWorker,
        this.active_gpu_devices,
      );
      this.updateTimer = setTimeout(this.updateLabel.bind(this), 250);
      this.statTimer = setTimeout(this.updateStats.bind(this), 1000);
    } catch (e) {
      console.log(e);
      this.error = e.message;
      // this.error = "Error Connecting to the Selected Pool";
    }
  }

  updateStats() {
    this.mining = this.isMining();
    this.stats = ElectronService.getMiningStats();

    if (this.mining) {
      if (this.isConnected()) {
        this.error = null;
      } else if (!this.isStopping()) {
        this.error = 'Disconnected from Pool, Reconnecting...';
      }
      this.statTimer = setTimeout(this.updateStats.bind(this), 1000);
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
}
