import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

export interface IUpdateInfo {
  size: string;
  version: string;
  releaseNotes: string[];
  releaseDate: string;
}

export interface IUpdateProgress {
  total?: number;
  delta?: number;
  transferred?: number;
  percent?: number;
  bytesPerSecond?: number;
  timeRemaining?: number;
}

declare class ElectronInterface {
  showNotification(title: string, message: string);
  checkForUpdates(): Promise<IUpdateInfo>;
  downloadUpdate(progressCallback: (progress: IUpdateProgress) => void): Promise<any>;
  installUpdate(): void;
  // TODO: add proper typings for Mining classes/functions
  MeritMiner: any;
  getMinerInstance: Function;
}

declare global {
  interface Window {
    electron: ElectronInterface;
  }
}

let miner;

declare const WEBPACK_CONFIG: any;

export class ElectronService {

  static get isElectronAvailable(): boolean {
    return typeof window.electron !== 'undefined';
  }

  static get electron(): ElectronInterface {
    return window.electron;
  }

  static showNotification(title: string, message: string) {
    if (this.isElectronAvailable) {
      this.electron.showNotification(title, message);
    }
  }

  static checkForUpdates(): Promise<IUpdateInfo> {
    if (this.isElectronAvailable) {
      return this.electron.checkForUpdates();
    }
  }

  static downloadUpdate(): Observable<IUpdateProgress> {
    return new Observable<IUpdateProgress>((observer: Observer<IUpdateProgress>) => {
      observer.next({
        total: 0,
        transferred: 0,
        percent: 0,
        bytesPerSecond: 0
      });

      this.electron.downloadUpdate((progress: IUpdateProgress) => {
        if (progress.percent === 100) {
          observer.complete();
        } else {
          observer.next(progress);
        }
      });
    });
  }

  static installUpdate() {
    return this.electron.installUpdate();
  }

  static getMinerInstance()  {
    if (!ElectronService.isElectronAvailable) {
      return miner;
    }

    if(!miner) {
      miner = new window.electron.MeritMiner();
    }

    return miner;
  }

  static setAgent() {
    const m = ElectronService.getMinerInstance();
    if(!m) { return false; }

    let version = "0.0.0";
    if (typeof WEBPACK_CONFIG !== 'undefined') {
      version = WEBPACK_CONFIG.VERSION;
    }
    m.SetAgent("DLW", version);
  }

  static isMining() {
    const m = ElectronService.getMinerInstance();
    if(!m) { return false; }

    return m.IsStratumRunning() || m.IsMinerRunning();
  }

  static isConnectedToPool() {
    const m = ElectronService.getMinerInstance();
    if(!m) { return false; }

    return m.IsStratumConnected();
  }

  static isStopping() {
    const m = ElectronService.getMinerInstance();
    if(!m) { return false; }
    return m.IsStratumStopping() || m.IsMinerStopping();
  }

  static startMining(url:string, address: string, workers: number, threadsPerWorker: number, gpu_devices: number[]) {
    const m = ElectronService.getMinerInstance();
    if(!m) { return false; }

    console.log(url, address, workers, threadsPerWorker, gpu_devices);
    m.ConnectToStratum(url, address);

    try {
        m.StartMiner(workers, threadsPerWorker, gpu_devices);
    } catch (e) {
        console.log(e);
    }

    return true;
  }

  static stopMining() {
    const m = ElectronService.getMinerInstance();
    if(!m) { return false; }

    m.DisconnectStratum();
    m.StopMiner();
    return true;
  }

  static numberOfCores() {
    const m = ElectronService.getMinerInstance();
    if(!m) { return false; }
    return m.NumberOfCores();
  }

  static numberOfGPUDevices() {
    const m = ElectronService.getMinerInstance();
    if(!m) { return false; }
    return m.NumberOfGPUs();
  }

  static GPUDevicesInfo() {
    const m = ElectronService.getMinerInstance();
    if(!m) { return false; }
    return m.GPUsInfo();
  }

  static getMiningStats() {
    const m = ElectronService.getMinerInstance();
    if(!m) { return {}; }
    return m.MinerStats();
  }

  static getFreeMemoryOnDevice(device: number) {
    const m = ElectronService.getMinerInstance();
    if(!m) { return {}; }
    return m.FreeMemoryOnDevice(device);
  }
}
