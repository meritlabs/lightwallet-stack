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
        return resolve({
          pa: 'myt5UJyNCXVivR3UNCkw6kmSBY2Z3VTkdJ',
          se: 'e3492c67ef4ca85b54ab49ac4e8eadf9',
          sn: 'Someone',
          sk: '028f528e0768bae06507e6c441e84693c027fafe7ebca8958037bd04c7ac0466e7',
          bt: 1008
      });
      } else {
        const Branch = window['Branch'];
        Branch.initSession((data) => {
          return resolve({data});
        });
      };
    });
  }
}
