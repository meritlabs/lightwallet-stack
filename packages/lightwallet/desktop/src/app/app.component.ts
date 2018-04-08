import { Component, Renderer2, ViewEncapsulation } from '@angular/core';
import { EasyReceipt } from '@merit/common/models/easy-receipt';
import { EasyReceiveService } from '@merit/common/services/easy-receive.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { DOMController } from '@merit/desktop/app/components/dom.controller';

@Component({
  selector: 'merit-lw',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(private domCtrl: DOMController,
              private renderer2: Renderer2,
              private easyReceiveService: EasyReceiveService,
              private logger: LoggerService) {
    // Services can't inject Renderer, so this is a workaround.
    domCtrl.rnd = renderer2;
  }

  async ngOnInit() {
    await this.loadEasySendInBrowser();
  }

  private async loadEasySendInBrowser() {
    let search = window.location.search;
    if (search && search.length > 2) {
      try {
        const data: any = {};
        search
          .substr(1)
          .split('&')
          .forEach((q: any) => {
            q = q.split('=');
            data[q[0]] = q[1];
          });

        const easyReceipt: EasyReceipt = await this.easyReceiveService.validateAndSaveParams(data);
        this.logger.info('Returned from validate with: ', easyReceipt);
      } catch (e) {}
    }
  }
}
