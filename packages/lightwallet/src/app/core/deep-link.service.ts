import { Injectable } from '@angular/core';
import { Logger } from 'merit/core/logger';
import { PersistenceService } from 'merit/core/persistence.service';
import { Platform } from 'ionic-angular';


@Injectable()
export class DeepLinkService {
  constructor(
    private persistenceService: PersistenceService,
    private logger: Logger,
    private platform: Platform
  ) {
    this.logger.info("Hello Deep Link Service");
  }

  async getBranchData() {
    if (!this.platform.is('cordova')) {
      this.logger.warn('branch deeplinking is available on native devices only');
      return;
    } else {
      const Branch = window['Branch'];
      return new Promise<any>((resolve) => {
        Branch.initSession((data) => resolve(data));
      });
    }
  }
}
