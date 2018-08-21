import { Injectable } from '@angular/core';
import FBSDK from 'fb-sdk';
import { ENV } from '@app/env';

@Injectable()
export class SocialSharing {
  async authorizeFBSDK() {
    return await FBSDK(ENV.fbSDK);
  }
}