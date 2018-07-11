import { Injectable } from '@angular/core';
import { LoggerService } from '@merit/common/services/logger.service';

declare const Branch: any;

@Injectable()
export class DeepLinkService {
  constructor(private logger: LoggerService) {
    this.logger.info('Hello Deep Link Service');
  }

  async initBranch(): Promise<any> {
    if (typeof Branch !== 'undefined') {
      this.logger.info('Initing branch');
      Branch.setDebug(true);
      Branch.disableTracking(true);
      return Branch.initSession();
    } else {
      this.logger.info('Branch is undefined');
      return null;
    }
  }
}
