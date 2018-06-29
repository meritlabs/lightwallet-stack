declare const window: any;

let miner;

declare const WEBPACK_CONFIG: any;

export class ElectronService {

  static get isElectronAvailable(): boolean {
    return typeof window.electron !== 'undefined';
  }

  static showNotification(title: string, message: string) {
    if (ElectronService.isElectronAvailable) {
      window.electron.showNotification(title, message);
    }
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
