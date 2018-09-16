import { Component, Renderer2, ViewEncapsulation } from '@angular/core';
import { EasyReceipt } from '@merit/common/models/easy-receipt';
import { EasyReceiveService } from '@merit/common/services/easy-receive.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { PersistenceService2, StorageKey } from '@merit/common/services/persistence2.service';
import { DOMController } from '@merit/desktop/app/components/dom.controller';
import { UpdateDialogController } from '@merit/desktop/app/components/update-dialog/update-dialog.controller';
import { ElectronService, IUpdateInfo } from '@merit/desktop/services/electron.service';

@Component({
  selector: 'merit-lw',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  constructor(private domCtrl: DOMController,
              private renderer2: Renderer2,
              private easyReceiveService: EasyReceiveService,
              private logger: LoggerService,
              private updateDialogCtrl: UpdateDialogController,
              private persistenceService: PersistenceService2) {
    // Services can't inject Renderer, so this is a workaround.
    domCtrl.rnd = renderer2;
  }

  async ngOnInit() {
    await this.loadEasySendInBrowser();
    this.checkForUpdates();
  }

  private async checkForUpdates() {
    const updateInfo: IUpdateInfo = await ElectronService.checkForUpdates();

    if (!updateInfo) {
      return;
    }

    const lastIgnoredVersion: string = await this.persistenceService.getValue(StorageKey.LastIgnoredUpdate);

    if (lastIgnoredVersion === updateInfo.version) {
      // We ignored this version in the past; let's not remind the user about it again.
      return;
    }

    this.updateDialogCtrl.show(updateInfo);
  }

  private async loadEasySendInBrowser() {
    let search = window.location.search;
    if (search && search.length > 2) {
      try {
        const params = this.easyReceiveService.parseEasySendUrl(search);
        const easyReceipt: EasyReceipt = await this.easyReceiveService.validateAndSaveParams(params);
        if (easyReceipt) {
          // Let's remove the Query Params from the URL so that the user is not continually loading the same
          // EasyReceipt every time they re-open the app or the browser.
          window.history.replaceState({}, document.title, document.location.pathname);
        }
        this.logger.info('Returned from validate with: ', easyReceipt);
      } catch (e) {
      }
    }
  }
}
