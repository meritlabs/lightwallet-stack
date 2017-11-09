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
   
    

    return new Promise((resolve, reject) => {
      resolve({
        uc: '12345',
        '~referring_link': 'blblb', 
        sn: 'mock user',
        se: '23412',
        sk: 'abc123',
        bt: 10
      }); 
    });
      
    // return new Promise((resolve, reject) => {
    //   if (!this.platform.is('cordova')) { 
    //     this.logger.warn('branch deeplinking is available on native devices only');
    //     return resolve(); 
    //   }
    //   const Branch = window['Branch'];
    //   Branch.initSession(data => {
    //     if (data['+clicked_branch_link']) {
    //       resolve(data);
    //     } else {
    //       resolve();
    //     }
    //   });
    // });

  }

    
}