import { Injectable } from '@angular/core';
import {Wallet} from "../models/wallet";

@Injectable()
export class ProfileService {

  getWallets():Array<Wallet> {
    return [];
  }

  public createProfile(): Promise<any> {
    return new Promise((resolve, reject) => {

      this.logger.info('Creating profile');
      let defaults = this.configProvider.getDefaults();
      let config = this.configProvider.get();
      let profile = this.profile.create();
      this.persistenceProvider.storeNewProfile(profile).then((err: any) => {
        this.bindProfile(profile).then(() => {
          // ignore NONAGREEDDISCLAIMER
          return resolve();
        });
      }).catch((err) => {
        if (err && err.toString().match('NONAGREEDDISCLAIMER')) {
          return reject();
        }
        return reject(err);
      });
    });
  }

  public bindProfile(profile: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let config = this.configProvider.get();

      let bindWallets = (): Promise<any> => {
        return new Promise((resolve, reject) => {

          let l = profile.credentials.length;
          let i = 0;
          let totalBound = 0;

          if (!l) {
            return resolve();
          }

          _.each(profile.credentials, (credentials) => {
            this.bindWallet(credentials).then((bound: number) => {
              i++;
              totalBound += bound;
              if (i == l) {
                this.logger.info('Bound ' + totalBound + ' out of ' + l + ' wallets');
                return resolve();
              }
            }).catch((err) => {
              return reject(err);
            });
          });
        });
      };

      bindWallets().then(() => {
        this.isDisclaimerAccepted().then(() => {
          return resolve();
        }).catch(() => {
          return reject(new Error('NONAGREEDDISCLAIMER: Non agreed disclaimer'));
        });
      }).catch((err: any) => {
        return reject(err);
      });
    });
  }

  public isDisclaimerAccepted(): Promise<any> {
    return new Promise((resolve, reject) => {

      let disclaimerAccepted = this.profile && this.profile.disclaimerAccepted;
      if (disclaimerAccepted) return resolve();

      // OLD flag
      this.persistenceProvider.getCopayDisclaimerFlag().then((val) => {
        if (val) {
          this.profile.disclaimerAccepted = true;
          return resolve();
        } else {
          return reject();
        }
      });
    });
  }

}