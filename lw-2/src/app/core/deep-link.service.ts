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

  public branchInit() {
    // only on devices
    if (!this.platform.is('cordova')) { return }
    const Branch = window['Branch'];
    Branch.initSession(data => {
      if (data['+clicked_branch_link']) {
        // read deep link data on click
        alert('Deep Link Data: ' + JSON.stringify(data));
      }
    });
  }
}