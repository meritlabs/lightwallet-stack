import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Logger } from '@merit/mobile/app/core/logger';
import { PersistenceService } from '@merit/mobile/app/core/persistence.service';

declare const Branch: any;

@Injectable()
export class DeepLinkService {
  constructor(private persistenceService: PersistenceService,
              private logger: Logger,
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
