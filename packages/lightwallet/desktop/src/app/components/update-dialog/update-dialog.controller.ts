import { Injectable } from '@angular/core';
import { DOMController } from '@merit/desktop/app/components/dom.controller';
import { UpdateDialogComponent } from '@merit/desktop/app/components/update-dialog/update-dialog.component';
import { IUpdateInfo } from '@merit/desktop/services/electron.service';

@Injectable()
export class UpdateDialogController {
  constructor(private domCtrl: DOMController) {}

  show(updateInfo: IUpdateInfo) {
    this.domCtrl.create(UpdateDialogComponent, updateInfo);
  }
}
