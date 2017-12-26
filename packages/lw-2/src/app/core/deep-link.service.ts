import * as Promise from 'bluebird';
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

  public getBranchData(): Promise<any> {

    return new Promise((resolve, reject) => {
      if (!this.platform.is('cordova')) {
        this.logger.warn('branch deeplinking is available on native devices only');
        return resolve();
      } else {
        const Branch = window['Branch'];
        Branch.initSession((data) => {
          return resolve(data);
        });
      };
    });
  }
}
