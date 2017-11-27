import * as Promise from 'bluebird';
import { Injectable } from '@angular/core';
import { Logger } from "merit/core/logger";
import { Feedback } from "./feedback.model";

@Injectable()
export class FeedbackServiceMock {

  constructor(
    private logger:Logger
  ) {

    this.logger.warn("Using mock service: FeedBackService");

  }

  public isFeedBackNeeded():Promise<boolean> {
    return Promise.resolve(true);
  }

  public sendFeedback(feedback:Feedback):Promise<any> {
    return Promise.resolve(true);
  }

}