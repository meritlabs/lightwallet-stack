import { Injectable } from '@angular/core';

import {Http} from '@angular/http';
import {Logger} from "merit/core/logger";

@Injectable()
export class AppUpdateServiceMock {

  constructor(
    private http:Http,
    private logger:Logger
  ) {
    this.logger.warn("Using a mock service: AppUpdateServiceMock ")
  }

  public isUpdateAvailable():Promise<boolean> {
    return new Promise((rs, rj) => {
      rs(true);
    })
  }


}
