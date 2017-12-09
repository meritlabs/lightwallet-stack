import * as Promise from 'bluebird';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Feedback } from "./feedback.model";
import { Logger } from "merit/core/logger";
import { ConfigService } from "merit/shared/config.service";


@Injectable()
export class FeedbackService {

  constructor(
    private http: HttpClient,
    private logger: Logger,
    private configService: ConfigService
  ) {
  }

  //todo it's working as a mock now!
  public isFeedBackNeeded(): Promise<boolean> {
    // check if we have stored feedbacks, for which version is latest
    // if we don't have any, resolve true
    // if we have some, compare versions
    return Promise.resolve(true);
  }

  public sendFeedback(feedback: Feedback): Promise<any> {
    return Promise.resolve(true);
  }
}