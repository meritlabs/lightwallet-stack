import { Injectable } from '@angular/core';
import { Logger } from 'merit/core/logger';
import * as _ from 'lodash';
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

  public getBranchData():Promise<any> {
  
      if (!this.platform.is('cordova')) { 
          this.logger.warn('branch deeplinking is available on native devices only');
          return Promise.resolve();
      } else {
        const Branch = window['Branch'];
        return Branch.initSession();
      }


  }

    
}