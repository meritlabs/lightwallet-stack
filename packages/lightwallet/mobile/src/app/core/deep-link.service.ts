import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { LoggerService } from '@merit/common/services/logger.service';

declare const Branch: any;

@Injectable()
export class DeepLinkService {
  constructor(private logger: LoggerService) {
    this.logger.info('Hello Deep Link Service');
  }

  async initBranch(handler: (data: any) => Promise<void>) {
    if (typeof Branch !== 'undefined') {
      this.logger.info('Initing branch');
      await Branch.setDebug(true);
      return Branch.initSession(handler);
    } else {
      this.logger.info('Branch is undefined');
      handler(null);
    }
  }
}
