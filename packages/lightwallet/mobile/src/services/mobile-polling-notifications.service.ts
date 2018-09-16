import { Injectable } from '@angular/core';
import { ConfigService, IAppConfig } from '@merit/common/services/config.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { PollingNotificationsService } from '@merit/common/services/polling-notification.service';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';

@Injectable()
export class MobilePollingNotificationsService extends PollingNotificationsService {
  constructor(store: Store<IRootAppState>,
              logger: LoggerService,
              private configService: ConfigService) {
    super(logger, store, null);
  }

  protected async pushNotificationsEnabled(): Promise<boolean> {
    const config: IAppConfig = await this.configService.load();
    return config && config.pushNotificationsEnabled;
  }
}
