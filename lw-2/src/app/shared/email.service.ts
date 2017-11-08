import { Injectable } from '@angular/core';
import {Promise} from 'bluebird';
import {ProfileService} from 'merit/core/profile.service';
import {ConfigService } from 'merit/shared/config.service';
import {WalletService} from 'merit/wallets/wallet.service';

import * as _ from 'lodash';

@Injectable()
export class EmailService {

    constructor(
        private profileService:ProfileService,
        private configService:ConfigService,
        private walletService:WalletService
    ) {
    }

    public  updateEmail(opts:any = {}):Promise<any> {

        return new Promise((resolve, reject) => {
            if (!opts.email) reject('no email provided');

            return this.profileService.getWallets().then((wallets) => {
                return this.configService.set({
                    emailFor: null, // Backward compatibility
                    emailNotifications: {
                        enabled: opts.enabled,
                        email: opts.enabled ? opts.email : null
                    }
                }).then((confg) => {
                    return this.walletService.updateRemotePreferences(wallets);
                });
            })
        });
        
      };
    
      public getEmailIfEnabled(config?) {
        config = config || this.configService.get();
        
        if (config.emailNotifications) {
          if (!config.emailNotifications.enabled) return;
    
          if (config.emailNotifications.email) 
            return config.emailNotifications.email;
        }
        
        if (_.isEmpty(config.emailFor)) return;
        
        let emails = _.values(config.emailFor);
        
        for(var i = 0; i < emails.length; i++) {
          if (emails[i] !== null && typeof emails[i] !== 'undefined') {
            return emails[i];
          }
        }
      };
    
      public init() {

        let config:any = this.configService.get(); 
        
        if (config.emailNotifications && config.emailNotifications.enabled) {
            if (config.emailNotifications.email) return;

            let currentEmail = this.getEmailIfEnabled(config);

            this.updateEmail({
              enabled: currentEmail ? true : false,
              email: currentEmail
            });
        }
      };

}