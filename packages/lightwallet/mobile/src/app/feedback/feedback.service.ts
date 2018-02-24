import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Logger } from 'merit/core/logger';
import { ConfigService } from 'merit/shared/config.service';
import { Feedback } from './feedback.model';


@Injectable()
export class FeedbackService {

  constructor(private http: HttpClient,
              private logger: Logger,
              private configService: ConfigService) {
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