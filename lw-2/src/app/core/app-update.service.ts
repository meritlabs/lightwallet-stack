import { Injectable } from '@angular/core';

import {Http} from '@angular/http';
import {Logger} from "merit/core/logger";

@Injectable()
export class AppUpdateService {


  constructor(
    private http:Http,
    private logger:Logger
  ) {}

  //TODO It's a mock now!!
  public isUpdateAvailable():Promise<boolean> {
    return new Promise((rs, rj) => {
      rs(true);
    })
  }


}
