import { Injectable } from '@angular/core';

@Injectable()
export class CreateVaultService {

    createVault(): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log('CreateVaultService#createVault');
            resolve();
        });
    }
       
}