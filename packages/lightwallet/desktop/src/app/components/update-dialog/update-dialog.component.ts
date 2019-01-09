import { Component, NgZone } from '@angular/core';
import { PersistenceService2, StorageKey } from '@merit/common/services/persistence2.service';
import { IDynamicComponent } from '@merit/desktop/app/components/dom.controller';
import { ElectronService, IUpdateInfo, IUpdateProgress } from '@merit/desktop/services/electron.service';

@Component({
  selector: 'update-dialog',
  templateUrl: './update-dialog.component.html',
  styleUrls: ['./update-dialog.component.sass'],
})
export class UpdateDialogComponent implements IDynamicComponent {
  destroy: Function;
  step: 'prompt' | 'downloaded' | 'downloading' = 'prompt';
  downloadProgress: IUpdateProgress = {};

  updateInfo: IUpdateInfo;

  constructor(private persistenceService: PersistenceService2, private ngZone: NgZone) {}

  init(updateInfo: IUpdateInfo) {
    this.updateInfo = updateInfo;
  }

  downloadUpdate() {
    this.step = 'downloading';
    ElectronService.downloadUpdate().subscribe({
      next: (val: IUpdateProgress) => {
        this.ngZone.run(() => {
          val.timeRemaining = Math.ceil((val.total - val.transferred) / val.bytesPerSecond);
          val.transferred = Math.round((val.transferred / 1024 / 1024) * 100) / 100;
          val.total = Math.round((val.total / 1024 / 1024) * 100) / 100;
          val.percent = Math.round(val.percent);
          this.downloadProgress = val;
        });
      },
      complete: () => {
        this.ngZone.run(() => {
          this.step = 'downloaded';
        });
      },
    });
  }

  installUpdate() {
    ElectronService.installUpdate();
  }

  skipUpdate() {
    this.persistenceService.setValue(StorageKey.LastIgnoredUpdate, this.updateInfo.version);
    this.dismiss();
  }

  dismiss() {
    this.destroy();
  }
}
