import { Injectable } from '@angular/core';
import * as Promise from 'bluebird';

@Injectable()
export class RenewVaultService {

    renewVault(): Promise<any> {
        return Promise.resolve();
    }

}