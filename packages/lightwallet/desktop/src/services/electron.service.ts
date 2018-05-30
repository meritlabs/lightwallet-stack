declare const window: any;

let miner;

export class ElectronService {

  static get isElectronAvailable(): boolean {
    return typeof window.electron !== 'undefined';
  }

  static showNotification(title: string, message: string) {
    if (ElectronService.isElectronAvailable) {
      window.electron.showNotification(title, message);
    }
  }

  static getMinerInstance() { 
    if (!ElectronService.isElectronAvailable) {
      return miner;
    }

    if(!miner) {
      miner = new window.electron.MeritMiner();
    }

    return miner;
  }

  static isMining() {
    let m = ElectronService.getMinerInstance();
    if(!m) { return false; } 

    return m.IsStratumRunning() || m.IsMinerRunning();
  }

  static isStopping() {
    let m = ElectronService.getMinerInstance();
    if(!m) { return false; } 
    return m.IsStratumStopping() || m.IsMinerStopping();
  }

  static startMining(url:string, address: string, workers: number, threadsPerWorker: number) {
    let m = ElectronService.getMinerInstance();
    if(!m) { return false; } 
    
    m.ConnectToStratum(url, address);
    m.StartMiner(workers, threadsPerWorker);
    return true;
  }

  static stopMining() {
    let m = ElectronService.getMinerInstance();
    if(!m) { return false; } 

    m.DisconnectStratum();
    m.StopMiner();
    return true;
  }

  static numberOfCores() {
    let m = ElectronService.getMinerInstance();
    if(!m) { return false; } 
    return m.NumberOfCores();
  }
}
