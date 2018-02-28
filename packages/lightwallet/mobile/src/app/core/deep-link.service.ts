import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { LoggerService } from '@merit/common/services/logger.service';

declare const Branch: any;

@Injectable()
export class DeepLinkService {
  constructor(private logger: LoggerService,
              private platform: Platform) {
    this.logger.info('Hello Deep Link Service');
  }

  async initBranch(handler: (data: any) => Promise<void>) {
    if (!this.platform.is('cordova')) {
      this.logger.warn('branch deeplinking is available on native devices only');
      return;
    }

    if (typeof Branch !== 'undefined') {
      this.logger.info('Initing branch');
      Branch.setDebug(true);
      Branch.initSession(handler);
    }
  }
}
