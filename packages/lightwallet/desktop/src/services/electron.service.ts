declare const window: any;

export class ElectronService {
  static get isElectronAvailable(): boolean {
    return typeof window.electron !== 'undefined';
  }

  static showNotification(title: string, message: string) {
    if (ElectronService.isElectronAvailable) {
      window.electron.showNotification(title, message);
    }
  }
}
