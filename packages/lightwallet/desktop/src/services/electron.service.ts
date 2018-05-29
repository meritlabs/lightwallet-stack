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

  static startMining(address: string, workers: number, threadsPerWorker: number) {
    let m = ElectronService.getMinerInstance();
    if(!m) { return; } 

    let url = 'stratum+tcp://pool.merit.me:3333';
    m.ConnectToStratum(url, address);
    m.StartMiner(workers, threadsPerWorker);
  }

  static stopMining() {
    let m = ElectronService.getMinerInstance();
    if(!m) { return; } 

    m.DisconnectStratum();
    m.StopMiner();
  }

}
