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
}

declare global {
  interface Window {
    electron: ElectronInterface;
  }
}

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
        bytesPerSecond: 0,
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
}
